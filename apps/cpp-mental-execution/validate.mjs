import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import vm from "node:vm";

const root = new URL("../../", import.meta.url);
const htmlPath = new URL("dist/cpp-mental-execution.html", root);
const html = await Bun.file(htmlPath).text();
const script = html.match(/<script>\n([\s\S]*)\n  <\/script>/)?.[1];
if (!script) throw new Error("Build dist/cpp-mental-execution.html before compiler validation.");

const context = { window: {}, document: { addEventListener() {} }, console };
vm.createContext(context);
vm.runInContext(script, context);
const api = context.window.PracticeLabCppMentalExecution;
if (!api || api.families.length !== 39) throw new Error("Expected all 39 C++ question families.");

const compilers = ["g++", "clang++"];
const flags = ["-std=c++17", "-pedantic-errors", "-Wall", "-Wextra"];
const work = await mkdtemp(join(tmpdir(), "practice-lab-cpp-"));

function run(command, expectedStatus = 0) {
  const result = Bun.spawnSync(command, { stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== expectedStatus) {
    const stderr = new TextDecoder().decode(result.stderr);
    throw new Error(`${command[0]} ${command.slice(1).join(" ")} exited ${result.exitCode}; expected ${expectedStatus}\n${stderr}`);
  }
}

const safe = String.raw`
#include <cassert>
#include <cstdint>
#include <iterator>
#include <list>
#include <memory>
#include <string>
#include <type_traits>
#include <utility>
#include <vector>

namespace overloads {
enum class Pick { a, b, c };
Pick f(int&) { return Pick::a; }
Pick f(const int&) { return Pick::b; }
Pick f(int&&) { return Pick::c; }
template<class T> Pick relay(T&& x) { return f(std::forward<T>(x)); }
template<class T> constexpr int specialized(T) { return 1; }
template<class T> constexpr int specialized(T*) { return 2; }
}

struct S {
  int x = 4;
  int y = 7;
  int twice(int n) const { return 2 * n; }
};

int inc(int x) { return x + 1; }
template<class F> int apply_value(F f, int x) { return f(x); }

int main() {
  int a = 3, b = 5;
  a += b; b = a - b;
  assert(a == 8 && b == 3);

  int x = 4;
  int y = x++;
  assert(x == 5 && y == 4);
  bool hit = (x > 0) || (++x > 0);
  assert(hit && x == 5);

  int& r = x;
  int* p = &x;
  int other = 9;
  p = &other;
  r += *p;
  assert(x == 14 && other == 9);

  const int cx = 4;
  auto plain = cx;
  auto& ref = cx;
  auto&& forwarding = x;
  static_assert(std::is_same_v<decltype(plain), int>);
  static_assert(std::is_same_v<decltype(ref), const int&>);
  static_assert(std::is_same_v<decltype(forwarding), int&>);
  static_assert(std::is_same_v<decltype((x)), int&>);
  static_assert(std::is_same_v<decltype(std::move(x)), int&&>);

  std::uint8_t byte = 255;
  auto promoted = byte + 1;
  static_assert(std::is_same_v<decltype(promoted), int>);
  assert(promoted == 256);

  assert(overloads::f(x) == overloads::Pick::a);
  assert(overloads::f(cx) == overloads::Pick::b);
  assert(overloads::f(0) == overloads::Pick::c);
  assert(overloads::relay(0) == overloads::Pick::c);
  assert(overloads::specialized(&x) == 2);

  const int& temporary = 3 + 4;
  assert(temporary == 7);
  std::vector<int> v{1, 2, 3};
  auto before = v.begin();
  v.erase(v.begin() + 1);
  assert(*before == 1);
  std::list<int> list{1, 2};
  auto stable = list.begin();
  list.insert(list.end(), 3);
  assert(*stable == 1);

  std::string text = "hi";
  auto&& alias = std::move(text);
  assert(alias == "hi" && text == "hi");
  auto owner = std::make_unique<int>(7);
  auto receiver = std::move(owner);
  assert(!owner && *receiver == 7);
  auto shared = std::make_shared<int>(4);
  auto shared2 = shared;
  assert(shared.use_count() == 2 && shared2.use_count() == 2);

  int* array_of_pointers[4]{};
  int row[4]{};
  int (*pointer_to_array)[4] = &row;
  static_assert(std::is_same_v<decltype(array_of_pointers), int*[4]>);
  static_assert(std::is_same_v<decltype(pointer_to_array), int(*)[4]>);
  using P = int*;
  const P const_pointer = nullptr;
  static_assert(std::is_same_v<decltype(const_pointer), int* const>);

  using Fn = int(*)(int);
  Fn fn = inc;
  assert(fn(4) == 5);
  S object;
  int S::* data = &S::y;
  assert(object.*data == 7);
  int (S::*method)(int) const = &S::twice;
  assert((object.*method)(4) == 8);

  int captured = 1;
  auto by_value = [captured]() mutable { return ++captured; };
  captured = 7;
  assert(by_value() == 2 && captured == 7);
  auto stateful = [n = 0](int n0) mutable { return n0 + ++n; };
  assert(apply_value(stateful, 10) == 11);
  assert(apply_value(stateful, 10) == 11);
}
`;

const compileFailures = [
  `int main(){ double d=3.5; int x{d}; (void)x; }`,
  `void f(long){} void f(unsigned long){} int main(){ f(0); }`,
  `#include <memory>\nint main(){ auto p=std::make_unique<int>(1); auto q=p; }`,
  `struct S{ int value(){return 4;} }; int main(){ int(S::*p)()=&S::value; const S s{}; return (s.*p)(); }`
];

const semanticOnly = [
  `void f(int,int){} int main(){ int i=0; f(i++,i++); }`,
  `int main(){ int i=0; return i++ + i++; }`,
  `int main(){ int n=-8; return n >> 1; }`
];

try {
  await writeFile(join(work, "safe.cpp"), safe);
  for (const compiler of compilers) {
    const binary = join(work, compiler.replaceAll("+", "p"));
    run([compiler, ...flags, join(work, "safe.cpp"), "-o", binary]);
    run([binary]);

    for (let index = 0; index < compileFailures.length; index += 1) {
      const path = join(work, `fail-${index}.cpp`);
      await writeFile(path, compileFailures[index]);
      const result = Bun.spawnSync([compiler, ...flags, "-fsyntax-only", path], { stdout: "pipe", stderr: "pipe" });
      if (result.exitCode === 0) throw new Error(`${compiler} unexpectedly accepted compile-fail fixture ${index}.`);
    }

    for (let index = 0; index < semanticOnly.length; index += 1) {
      const path = join(work, `semantic-${index}.cpp`);
      await writeFile(path, semanticOnly[index]);
      run([compiler, ...flags, "-fsyntax-only", path]);
    }
  }
  console.log("C++ compiler validation passed: GCC + Clang, safe run/static assertions, compile-fail fixtures, semantic-only nonportable fixtures");
} finally {
  await rm(work, { recursive: true, force: true });
}
