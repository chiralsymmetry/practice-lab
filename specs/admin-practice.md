# Unix Shell and Administration Practice — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, virtual-machine/simulator, answer-parser, and UI implementers

## 1. Topic overview

### Goal

Develop reliable mental execution of common Unix shell and administration tasks: predict arguments and data flow, choose robust text-processing commands, reason about permissions and filesystem objects, interpret process state, and diagnose basic network behavior.

The learner should become safer and more precise at the command line, not merely memorize flags.

### Scope

- lexical and physical path resolution;
- shell tokenization, quoting, parameter expansion, field splitting, and pathname expansion;
- globs and their distinction from regular expressions;
- standard input/output/error, redirection order, pipelines, exit status, `&&`, and `||`;
- controlled subsets of `grep`, `cut`, `sort`, `uniq`, `wc`, `sed`, `awk`, `find`, and `xargs`;
- POSIX extended regular-expression matching, captures, and substitutions;
- Unix permission modes, symbolic `chmod`, `umask`, access checks, directory permissions, and selected special bits;
- symbolic links, hard links, inodes, file deletion, free blocks, and free inodes;
- process tables, process selection, signals, stopped/running/zombie states, and parent/child lifecycle;
- IPv4 CIDR, subnet membership, routing by longest prefix, URL endpoints, DNS chains, listening sockets, and small HTTP route tables;
- robust command construction and layered troubleshooting.

The app is entirely offline. Every filesystem, process table, command result, DNS zone, route table, and service is synthetic and lives only in the question model.

### Dialect and platform contract

The initial dialect ID is `bash-gnu-v1`:

- non-interactive Bash-compatible shell subset;
- GNU-style `grep`, Coreutils, `sed`, `find`, and `xargs` behaviors where the family declares them;
- a controlled POSIX-compatible `awk` subset;
- POSIX ERE for `grep -E` and `sed -E`;
- `LC_ALL=C`;
- ASCII fixture contents unless a family explicitly teaches Unicode;
- default `IFS` of space, tab, and newline;
- Bash defaults `nullglob=off`, `dotglob=off`, `globstar=off`, `failglob=off`, and `pipefail=off`;
- pathname-expansion results sorted by bytewise `C`-locale order.

The dialect label and relevant option state must appear in Learn material and in any question whose answer changes under another shell or tool implementation.

Each modeled rule and supported option must carry a reference-manual section and fixture version in implementation metadata. Upstream behavior changes do not silently change saved questions: they require a new dialect/model version.

### Shell evaluation model

The implemented word-processing order is:

1. tokenize and parse quotes/operators;
2. parameter expansion;
3. field splitting on unquoted expansion results;
4. pathname expansion on unquoted glob characters;
5. quote removal.

Single quotes preserve every enclosed character. Double quotes permit parameter expansion but suppress field splitting and pathname expansion of the result. An unquoted backslash quotes the next character.

Initial generation excludes command substitution, process substitution, arrays, arithmetic expansion, brace expansion, `eval`, aliases, functions, here-documents, here-strings, and programmable completion. Positional parameters may be added only through explicitly modeled families.

An unmatched pathname pattern remains a literal word because `nullglob` and `failglob` are off. `*` and `?` do not match a leading `.` at the start of a pathname component unless the pattern component also begins with `.`.

### Stream and status model

- File descriptors 0, 1, and 2 are standard input, output, and error.
- Redirections are processed left to right.
- `>` creates or truncates its target before command execution; `>>` appends.
- `2>&1` duplicates the current destination of descriptor 1 at that point.
- A pipeline connects each command’s stdout to the next command’s stdin; stderr remains separate unless redirected.
- Without `pipefail`, a foreground pipeline’s status is its last command’s status.
- With `pipefail`, it is the rightmost nonzero command status, or zero if all commands succeed.
- `&&` runs its right operand only after status zero; `||` runs its right operand only after nonzero.
- In Bash, `&&` and `||` have equal precedence and associate left to right.
- `;` runs the next command regardless of prior status.

Utility status conventions used by the simulator are declared per utility. For example, modeled `grep` returns 0 for one or more selected lines, 1 for no selected lines, and 2 for a modeled error.

### Filesystem and security model

- Paths are byte strings excluding NUL; components exclude `/`.
- The virtual filesystem may contain regular files, directories, symbolic links, and hard links.
- Each inode stores owner UID, group GID, mode, type, size/blocks, and link count.
- Access checks model a nonprivileged process with one effective UID, one effective GID, and supplementary groups.
- ACLs, capabilities, SELinux/AppArmor, immutable flags, mount namespaces, and superuser bypass are excluded initially.
- If the process owns an inode, owner bits are used; otherwise a matching group uses group bits; otherwise other bits are used. Classes are not combined.
- Directory `r` lists names, `x` permits traversal/search of known names, and `w+x` permits ordinary entry creation/removal subject to sticky-directory rules.
- Removing a directory entry depends primarily on the parent directory, not on write permission to the referenced regular file.
- A sticky directory permits entry removal only by the file owner, directory owner, or a privileged process; the initial simulator omits the privileged exception from generated learner identities.
- `umask` removes permission bits from a program’s requested creation mode; it never adds bits.
- Symbolic links have path text, not file contents. Access follows them unless the operation explicitly acts on the link.

### Text and regex model

- Fixtures expose whether a final newline exists.
- `wc -l` counts newline bytes; `wc -w` counts C-locale whitespace-delimited words; `wc -c` counts bytes.
- `sort` uses C-locale bytewise ordering unless `-n` is shown. Stable-key questions use `-s`.
- `uniq` compares adjacent lines only.
- `cut -d` uses one explicit delimiter character and 1-based fields.
- `find -name` uses glob metacharacters, not regex, but it is evaluated by `find`, not shell pathname expansion. In this GNU model, a leading `.` is not special to `-name`, so `*.log` can match `.hidden.log`.
- Regex families use POSIX ERE: `.`, bracket expressions, `* + ? {m,n}`, grouping `()`, alternation `|`, and anchors `^ $`.
- PCRE features such as lookaround, lazy quantifiers, `\d`, `\w`, and backtracking-control syntax are excluded.
- Capture questions are generated only where POSIX leftmost-longest matching yields unambiguous subexpressions.

### Network model

- IPv4 addresses are 32-bit values.
- Ordinary host-subnet questions use prefixes `/1` through `/30`; `/31` and `/32` appear only in a separately explained point-to-point/single-host variant.
- A route is `(prefix, next hop/interface, metric)`. Selection uses longest prefix, then lowest metric among equal prefixes.
- Policy routing, ECMP, NAT, stateful firewall behavior, IPv6 routing, multicast, and ARP/neighbor-discovery timing are excluded initially.
- DNS questions use synthetic zones and only the displayed records/cache state.
- Socket questions distinguish protocol, local address, and local port. `0.0.0.0` is the modeled wildcard for all local IPv4 addresses; `127.0.0.1` is loopback-only.
- URL parsing supports `http` and `https`, bracketed IPv6 literals only at advanced recognition level, explicit ports, path, query, and fragment.
- Default ports are 80 for HTTP and 443 for HTTPS.

### Exclusions

- execution of real commands, containers, VMs, remote systems, or user-supplied scripts;
- a complete Bash parser or faithful emulation of all GNU utility options;
- PowerShell, Windows CMD, fish, zsh-specific syntax, and BSD/GNU comparison drills in the initial release;
- distro-specific package managers, init-system trivia, kernel tuning, bootloaders, RAID/LVM mutation, and cloud-vendor CLIs;
- destructive command practice against real or plausible user paths;
- password cracking, credential collection, exploit development, persistence, evasion, or offensive network scanning;
- “fix it with `chmod 777`,” immediate `kill -9`, `curl | sh`, parsing `ls`, or other brittle habits presented as best practice;
- open-ended incident diagnosis with several equally plausible root causes;
- questions graded by exact cosmetic whitespace when the utility does not semantically require it.

### Global answer conventions

- Command-output answers preserve line order, contents, and meaningful delimiters.
- A final newline is shown with an optional `⏎` marker in explanations; the input control does not require typing that marker.
- Argument-vector answers use one field per argument so spaces inside an argument remain visible.
- File and match result sets ignore order unless the prompt explicitly requests processing order.
- Paths are case-sensitive and normalize repeated `/`, `.` components, and resolvable `..` according to the declared lexical/physical mode.
- Modes accept four-digit octal such as `0754` and symbolic `rwxr-xr--`; special bits require the leading octal digit.
- Exit status is an integer 0–255 in modeled normal exits.
- IP addresses and masks use canonical dotted decimal; CIDR prefixes use `/n`.
- Probabilistic or timing-dependent answers are not generated.
- Multiple-choice questions must have one answer under the displayed dialect and model.

### Difficulty philosophy

Difficulty should increase through interacting expansion stages, stream routing, stateful traces, adverse filenames, permission-class precedence, symlink indirection, collision of plausible tool semantics, or multi-layer network reasoning.

It must not increase through giant file trees, long opaque command lines, obscure flags, memorizing hundreds of service ports, output too large to inspect, or platform quirks outside the declared dialect.

### Generator and oracle model

Every question stores:

- dialect/model version;
- semantic command AST rather than only command text;
- virtual filesystem/process/network state;
- exact stdin/stdout/stderr/status result;
- affected resources;
- stable family identifier;
- misconception and safety tags;
- difficulty dimensions;
- derivation trace;
- structural signature for repetition suppression.

Runtime generation and checking happen locally in JavaScript. Build-time validation may compare curated command fixtures with installed reference tools, but the standalone app never invokes a real shell.

## 2. Category: Shell words, paths, and globs

### Category purpose

Train recognition of what the shell turns source text into before a command receives its argument vector.

### Learn

Commands receive arguments, not quotes. Quotes influence expansion and are then removed:

- `"$name"` produces one argument;
- `$name` may split into several arguments and then expand glob characters;
- `'$name'` produces the literal text `$name`.

Shell globs match existing pathnames. They are not regular expressions.

### Prerequisites

Basic directory-tree and command-line concepts.

### Subcategories

1. Lexical paths
2. Pathname expansion
3. Quoting and parameter expansion
4. Final argument vectors

### Family `resolve_lexical_path`

**Learner task.** Resolve an absolute or relative path without following symbolic links.

**Response mode.** Path input.

**Question template.** `With cwd {cwd}, lexically normalize {path}.`

**Answer derivation.** Prepend cwd if relative; collapse empty and `.` components; each `..` removes one ordinary component but cannot move above root.

**Instance constraints and rejection rules.** No symlink components; no nonexistent-component policy ambiguity; resulting path unique.

**Difficulty.** Relative child; `.` and repeated slash; several `..`; near-root; inverse missing cwd.

**Feedback.** Show a component stack.

**Examples.**

1. cwd `/srv/app`, path `logs/error.log` → `/srv/app/logs/error.log`. L1.
2. cwd `/srv/app/log`, path `../config/./prod` → `/srv/app/config/prod`. L2.
3. cwd `/a/b`, path `../../../tmp//x` → `/tmp/x`. L3.

**Validation.** Independent component-stack resolver and root-boundary tests.

### Family `expand_pathname_glob`

**Learner task.** Determine the pathname arguments produced by a shell glob.

**Response mode.** Ordered sequence of paths.

**Question template.** `In {directory_tree}, expand {pattern} under {shell_options}.`

**Answer derivation.** Match each path component using Bash pathname rules, suppress leading-dot matches as declared, then sort matches in C-locale order; retain literal pattern if no match.

**Instance constraints and rejection rules.** 3–12 relevant entries; patterns from `*`, `?`, and bracket classes; no extglob or globstar.

**Difficulty.** One component; `?`/class; nested components; hidden files; unmatched literal.

**Misconceptions and feedback.** Diagnose regex interpretation, matching `/`, including dotfiles, or deleting an unmatched pattern.

**Examples.**

1. files `a.txt,b.txt,c.md`; `*.txt` → `a.txt,b.txt`. L1.
2. files `.env,a.env,b.txt`; `*.env` → `a.env`. L2.
3. files `logs/a.log,logs/10.log,logs/old/x.log`; `logs/?.log` → `logs/a.log`. L3.

**Validation.** AST glob matcher plus curated Bash-reference fixtures.

### Family `expand_shell_word`

**Learner task.** Determine fields produced by parameter expansion, quoting, splitting, and globbing.

**Response mode.** Ordered argument fields.

**Question template.** `Given {variables} and {files}, what fields does {word} produce?`

**Answer derivation.** Apply the normative expansion order to one shell word.

**Instance constraints and rejection rules.** One or two variables; default IFS; no command substitution; show empty values explicitly.

**Difficulty.** Literal/single quote; quoted variable; unquoted splitting; split then glob; empty quoted versus unquoted expansion.

**Feedback.** Show the value after each expansion stage.

**Examples.**

1. `name="Ada Lovelace"`; `"$name"` → one field `Ada Lovelace`. L1.
2. same value; `$name` → fields `Ada`, `Lovelace`. L2.
3. `pat="*.txt"` and files `a.txt,b.txt`; `$pat` → `a.txt,b.txt`, while `"$pat"` → literal `*.txt`. L4.

**Validation.** Word-expansion interpreter and field-count assertions.

### Family `command_argument_vector`

**Learner task.** Produce the exact `argv` a modeled command receives.

**Response mode.** Ordered named fields (`argv[0]`, `argv[1]`, …).

**Question template.** `What argument vector results from: {simple_command}?`

**Answer derivation.** Tokenize, expand each word, concatenate resulting fields, and remove quotes.

**Instance constraints and rejection rules.** Simple command only; redirections displayed separately; no syntax errors unless error recognition is the explicit variant.

**Difficulty.** Escaped spaces; mixed quote segments; variables; one word producing several arguments; option-like filename protected by `--`.

**Feedback.** Align source words with final argument fields.

**Examples.**

1. `touch "quarter 1.txt" report\ final` → `["touch","quarter 1.txt","report final"]`. L1.
2. `printf '%s\n' 'a  b' c` → `["printf","%s\\n","a  b","c"]`. L2.
3. with `x="-n 3"`, `tool $x -- "$x"` → `["tool","-n","3","--","-n 3"]`. L4.

**Validation.** Semantic lexer/expander plus exact field comparison.

## 3. Category: Streams, pipelines, and status

### Category purpose

Train prediction of where bytes go, which commands run, and which status controls later commands.

### Learn

Standard output and standard error are separate streams. A pipe carries stdout only. Redirection order matters:

- `cmd >all 2>&1` sends both streams to `all`;
- `cmd 2>&1 >out` leaves stderr at stdout’s old destination and sends only stdout to `out`.

### Prerequisites

Argument vectors and basic command execution.

### Subcategories

1. Descriptor routing
2. Pipeline data
3. Conditional command lists
4. Pipeline status

### Family `redirection_destinations`

**Learner task.** Determine final stdout/stderr destinations and file contents.

**Response mode.** Named fields for terminal/files.

**Question template.** `{command_behavior}; run {command_with_redirections}. Where do stdout and stderr go?`

**Answer derivation.** Begin with descriptors 1 and 2 attached to declared terminal streams; apply each redirection left to right; route emitted records.

**Instance constraints and rejection rules.** Command output order declared; targets distinct unless overwrite behavior is the point.

**Difficulty.** One redirection; stdout/stderr split; merge after stdout redirect; reverse-order duplication; append/truncate.

**Feedback.** Show a descriptor-arrow diagram after each redirection.

**Examples.**

1. command emits `OUT` on stdout; `cmd >out` → file `out` contains `OUT`. L1.
2. emits `OUT`/`ERR`; `cmd >out 2>err` → separate files. L2.
3. `cmd 2>&1 >out` → stdout in `out`, stderr at original terminal stdout. L4.

**Validation.** Descriptor-table simulator and byte-stream assertions.

### Family `pipeline_output`

**Learner task.** Compute stdout produced by a small pipeline.

**Response mode.** Multiline text.

**Question template.**

```text
Input:
{stdin}

What does this pipeline print?
{pipeline}
```

**Answer derivation.** Execute each modeled utility transform in order, passing exact stdout bytes forward.

**Instance constraints and rejection rules.** 2–4 stages; each stage from implemented subset; output at most 12 lines.

**Difficulty.** One filter and count; reorder then deduplicate; field extraction; multiple selection stages; stderr distraction.

**Feedback.** Show intermediate stream after every pipe.

**Examples.**

1. input `apple⏎pear⏎apricot⏎`; `grep -E '^ap' | wc -l` → `2`. L1.
2. input `b⏎a⏎b⏎`; `sort | uniq` → `a⏎b⏎`. L2.
3. input `a:9⏎b:12⏎c:3⏎`; `cut -d: -f2 | sort -n | tail -n1` → `12`. L4.

**Validation.** Compose independently tested utility transforms.

### Family `conditional_command_execution`

**Learner task.** Identify which commands execute and the final list status.

**Response mode.** Ordered command IDs plus integer status.

**Question template.** `Given command statuses {status_table}, evaluate {command_list}.`

**Answer derivation.** Parse `&&`, `||`, and `;` using Bash precedence/associativity and short-circuit rules.

**Instance constraints and rejection rules.** Commands have deterministic declared status; no subshell/background execution.

**Difficulty.** One operator; short-circuit chain; mixed equal-precedence `&&/||`; semicolon; status of last executed command.

**Feedback.** Annotate each operator with run/skip.

**Examples.**

1. `A=0,B=7`; `A && B` → executes A,B; final 7. L1.
2. `A=1,B=0,C=0`; `A && B || C` → executes A,C; final 0. L2.
3. `A=0,B=5,C=3`; `A || B && C` → executes A,C; final 3 because evaluation is left-associative. L4.

**Validation.** Command-list AST evaluator.

### Family `pipeline_exit_status`

**Learner task.** Determine a pipeline status with `pipefail` on or off.

**Response mode.** Integer status.

**Question template.** `Pipeline component statuses are {statuses}; with pipefail {state}, what is the pipeline status?`

**Answer derivation.** Off: final component. On: rightmost nonzero, else zero.

**Instance constraints and rejection rules.** 2–5 components; statuses declared in pipeline order; no signal termination.

**Difficulty.** All success; early failure masked; final failure; several failures with pipefail; connect to `&&/||`.

**Feedback.** Highlight the status selected by the active rule.

**Examples.**

1. statuses `[0,0]`, pipefail off → `0`. L1.
2. `[1,0]`, pipefail off → `0`. L2.
3. `[2,1,0]`, pipefail on → `1`, the rightmost nonzero. L3.

**Validation.** Direct status rule and list-integration tests.

## 4. Category: Text-processing tools

### Category purpose

Train exact selection and transformation of small text streams using common composable tools.

### Learn

Choose the smallest tool that directly represents the operation. `grep` selects lines, `cut` selects fields, `sort` orders lines, `uniq` merges adjacent equal lines, `wc` counts, `sed` substitutes, and `awk` handles record/field logic.

The app models declared subsets, not every implementation extension.

### Prerequisites

Pipelines and basic regex.

### Tool subset

- `grep -E`, `grep -F`, `-v`, `-c`, `-n`;
- `cut -d CHAR -f LIST`, with optional `-s`;
- `sort`, `-n`, `-r`, `-s`, and controlled `-k`;
- `uniq`, `-c`, `-d`, `-u`;
- `wc -l`, `-w`, `-c`;
- `head -n`, `tail -n`;
- `sed -E` substitution commands with optional `g`;
- controlled `awk` predicates, fields, `NR`, `NF`, `print`, integer variables, and `END`;
- GNU `find` predicates `-type`, `-name`, `-path`, `-maxdepth`, `!`, implicit AND, and `-o`;
- GNU `xargs -0`, `-n`, and `-r`, plus simple default-mode fixtures.

Generated sort keys use `-kN,N` to select exactly one blank-separated field, optionally with `n` or `r`. Without `-s`, equal selected keys fall back to whole-line comparison as GNU sort does; with `-s`, original relative order is preserved.

### Family `grep_selected_lines`

**Learner task.** Determine lines and status produced by a controlled `grep`.

**Response mode.** Multiline output plus optional status.

**Question template.** `Given {input}, what does {grep_command} print?`

**Answer derivation.** Apply fixed-string or ERE substring selection per line, invert if `-v`, then format `-n/-c`.

**Instance constraints and rejection rules.** Valid pattern; no binary files, recursive traversal, locale classes beyond ASCII, or multiple files initially.

**Difficulty.** Fixed substring; anchored ERE; inversion; count versus line output; line numbers and no-match status.

**Feedback.** Mark the matching span or reason for nonmatch on each line.

**Examples.**

1. lines `apple,pear,apricot`; `grep -E '^ap'` → `apple,apricot`, status 0. L1.
2. same; `grep -v -E 'p{2}'` → `pear,apricot`. L2.
3. lines `a1,a22,b3`; `grep -c -E '^a[0-9]{2}$'` → `1`, status 0. L3.

**Validation.** ERE/fixed matcher and formatting oracle.

### Family `cut_selected_fields`

**Learner task.** Compute fields selected by `cut`.

**Response mode.** Multiline text.

**Question template.** `Given {records}, what does {cut_command} print?`

**Answer derivation.** Split each line on the one-character delimiter without collapsing adjacent delimiters; select the requested 1-based fields in their original input order. Reordered or repeated field-list entries do not reorder or duplicate output.

**Instance constraints and rejection rules.** Field list controlled; lines without delimiter included normally or suppressed with `-s`; no byte/character mode.

**Difficulty.** One field; field list/range; empty field; line lacking delimiter; `-s`.

**Feedback.** Number fields on every record.

**Examples.**

1. `alice:100:admin`; `cut -d: -f1` → `alice`. L1.
2. same; `cut -d: -f1,3` → `alice:admin`. L2.
3. lines `a::c` and `plain`; `cut -s -d: -f2` → one empty output line from the first record only. L4.

**Validation.** Exact delimiter parser including empty fields.

### Family `sort_uniq_result`

**Learner task.** Predict logical rows produced by `sort`, `uniq`, or their composition.

**Response mode.** Ordered lines or `(count,line)` rows.

**Question template.** `Given {lines}, what does {command} produce under LC_ALL=C?`

**Answer derivation.** Apply lexical/numeric/key sort as shown; `uniq` then groups adjacent equal comparison keys.

**Instance constraints and rejection rules.** Key syntax from controlled subset; stable-key questions use `-s`; formatting of `uniq -c` graded logically, not by leading spaces.

**Difficulty.** Lexical sort; numeric contrast; adjacent-only uniq; sort then uniq; keyed stable sort.

**Feedback.** Show comparison keys and adjacent runs.

**Examples.**

1. `10,2,1`; `sort` → `1,10,2`. L1.
2. same; `sort -n` → `1,2,10`. L1.
3. `b,a,b,b`; `uniq -c` without sorting → `(1,b),(1,a),(2,b)`. L3.

**Validation.** C-locale comparator and adjacent-run oracle.

### Family `wc_counts`

**Learner task.** Compute newline, word, or byte count.

**Response mode.** Integer or named integer fields.

**Question template.** `For these exact bytes {visible_text}, compute {wc_mode}.`

**Answer derivation.** Count newline bytes, maximal non-whitespace word runs, or ASCII bytes.

**Instance constraints and rejection rules.** Whitespace rendered visibly; tabs/newlines annotated; Unicode excluded.

**Difficulty.** Lines; words with repeated whitespace; bytes; absent final newline; combined counts.

**Feedback.** Annotate each counted delimiter/run/byte span.

**Examples.**

1. bytes `a b⏎c⏎` → `wc -l=2`, `wc -w=3`, `wc -c=6`. L1.
2. bytes `alpha⏎beta` with no final newline → `wc -l=1`. L2.
3. bytes `a⇥⇥b⏎` where each `⇥` is one tab → words 2, bytes 5. L3.

**Validation.** Byte-array counting, not JavaScript character length.

### Family `sed_substitution`

**Learner task.** Apply a controlled `sed -E` substitution to each input line.

**Response mode.** Multiline text.

**Question template.** `Apply {sed_command} to {input}.`

**Answer derivation.** Find the POSIX leftmost-longest match; replace first or all nonoverlapping matches; expand `&` and `\1…\9`.

**Instance constraints and rejection rules.** One `s` command; delimiter escaped correctly; capture behavior unambiguous; no multiline pattern space or addresses initially.

**Difficulty.** Literal replacement; ERE match; `g`; whole-match `&`; capture reordering.

**Feedback.** Highlight match/captures and reconstructed line.

**Examples.**

1. `s/cat/dog/` on `cat cat` → `dog cat`. L1.
2. `s/[0-9]+/#/g` on `a12b34` → `a#b#`. L2.
3. `s/^([^,]+),([^,]+)$/\2 \1/` on `Lovelace,Ada` → `Ada Lovelace`. L4.

**Validation.** Regex AST substitution plus build-time GNU sed fixtures.

### Family `awk_program_output`

**Learner task.** Trace a small program in the declared `awk` subset.

**Response mode.** Multiline text or integer.

**Question template.**

```text
Input:
{records}

What does this print?
awk '{awk_program}'
```

**Answer derivation.** Split records using declared `FS`, set `NR/NF/$0/$i`, evaluate patterns/actions, retain variables, and run `END`.

**Instance constraints and rejection rules.** Integer arithmetic only; no implicit locale surprises, regex field separator, associative arrays, user functions, or implementation-specific formatting.

**Difficulty.** Field print; predicate; computed field; running sum/count; grouped two-variable aggregate.

**Feedback.** Show record number, fields, predicate result, and variable state.

**Examples.**

1. input `alice 3⏎bob 7⏎`; `$2 >= 5 {print $1}` → `bob`. L1.
2. same; `{sum += $2} END {print sum}` → `10`. L2.
3. input `a x⏎b⏎c y z⏎`; `NF >= 2 {count++} END {print count}` → `2`. L3.

**Validation.** Restricted AST interpreter and reference fixtures.

### Family `find_matching_paths`

**Learner task.** Determine the set of paths selected by a controlled `find` expression.

**Response mode.** Unordered path set.

**Question template.** `In {tree}, which paths satisfy find {start} {expression}?`

**Answer derivation.** Traverse modeled descendants and evaluate predicates with `!`, implicit AND, parentheses, and `-o` precedence.

Predicate precedence is parentheses, then `!`, then implicit/explicit AND, then `-o`.

**Instance constraints and rejection rules.** No permission errors, symlink following, `-delete`, `-exec`, `-prune`, time rounding, or unspecified output order.

**Difficulty.** Name/type; max depth; negation; AND; grouped OR.

**Misconceptions and feedback.** Distinguish basename `-name` from whole-path `-path`, glob syntax from regex, and `find`’s leading-dot behavior from shell pathname expansion. In the GNU model, `-path` matches the whole displayed path and its `*` may span `/`.

**Examples.**

1. tree has `a.log,b.txt,sub/c.log`; `find . -type f -name '*.log'` → `./a.log,./sub/c.log`. L1.
2. same with `-maxdepth 1` → `./a.log`. L2.
3. tree `a.log,b.tmp,sub/c.txt`; `find . -type f ! -name '*.tmp'` → `./a.log,./sub/c.txt`. L3.

**Validation.** Expression AST and set comparison.

### Family `xargs_argument_batches`

**Learner task.** Determine command invocations constructed by controlled `xargs`.

**Response mode.** Ordered list of argument vectors.

**Question template.** `Given exact input items {input}, what argv batches does {xargs_command} construct?`

**Answer derivation.** Tokenize simple default input or split NUL records with `-0`, then batch by `-n`.

**Instance constraints and rejection rules.** No size-limit batching, parallelism, replacement mode, EOF strings, or execution; the app only displays constructed argv.

**Difficulty.** Simple whitespace items; `-n`; spaces protected by NUL; newline in filename; empty input behavior.

**Feedback.** Visualize record boundaries and one argv per batch.

**Examples.**

1. input `a b c⏎`, `xargs -n2 echo` → `["echo","a","b"]`, then `["echo","c"]`. L1.
2. NUL items `a b\0c\0`, `xargs -0 echo` → one argv `["echo","a b","c"]`. L2.
3. NUL items `a⏎b\0--odd\0`, `xargs -0 -n1 tool --` → invocations ending `["--","a\nb"]` and `["--","--odd"]`. L4.

**Validation.** Byte-record parser; no real subprocess.

## 5. Category: Regular expressions

### Category purpose

Train exact reasoning about a declared regex language and keep regex separate from shell globbing.

### Learn

In POSIX ERE, `.` matches one non-newline character, `*` repeats the preceding expression zero or more times, `+` one or more, and anchors constrain position. A regex normally searches for a matching substring; use `^...$` to require the whole string.

### Prerequisites

Literal strings and character classes.

### Subcategories

1. Match recognition
2. Pattern construction
3. Captures
4. Replacement
5. Glob/regex discrimination

### Family `ere_match_set`

**Learner task.** Select every string matched by a POSIX ERE.

**Response mode.** Multiple-choice set.

**Question template.** `Which strings contain a match for ERE {pattern}?`

**Answer derivation.** Run the controlled ERE matcher with substring semantics unless anchored.

**Instance constraints and rejection rules.** 4–8 candidate strings; at least one match and nonmatch; distinctions target one or two operators.

**Difficulty.** Literal/class; anchors; quantifiers; alternation/grouping; overlapping plausible matches.

**Feedback.** Show first leftmost-longest match or failed condition.

**Examples.**

1. `^a` over `apple,cat,a,ba` → `apple,a`. L1.
2. `^[0-9]{2}$` over `7,07,123,a7` → `07`. L2.
3. `^(ab|c)+$` over `ab,c,abc,ac,abb` → `ab,c,abc`. L4.

**Validation.** ERE AST matcher and reference corpus.

### Family `construct_ere`

**Learner task.** Choose or complete a regex for a precisely described finite language/schema.

**Response mode.** Single-choice or constrained token slots.

**Question template.** `Which POSIX ERE matches exactly {language_description}?`

**Answer derivation.** Translate start/end, character choices, and repetition bounds into an anchored pattern.

**Instance constraints and rejection rules.** Description has one intended ERE under supported grammar; choices tested against generated positive/negative corpus.

**Difficulty.** Character class; exact length; optional suffix; alternatives; bounded repeated group.

**Distractors.** Missing anchors, glob syntax, off-by-one quantifier, ungrouped alternation, PCRE-only shorthand.

**Feedback.** Map every description clause to one pattern node.

**Examples.**

1. exactly three lowercase ASCII letters → `^[a-z]{3}$`. L1.
2. `cat` or `cats`, and nothing else → `^cats?$`. L2.
3. two or three repetitions of `ab` followed by one digit → `^(ab){2,3}[0-9]$`. L3.

**Validation.** Enumerate a bounded alphabet/length corpus and ensure unique choice.

### Family `capture_group_values`

**Learner task.** Give whole-match and capture-group text.

**Response mode.** Named text fields.

**Question template.** `For ERE {pattern} on {text}, give match and groups.`

**Answer derivation.** Apply POSIX leftmost-longest semantics and number groups by opening parenthesis.

**Instance constraints and rejection rules.** One match; 1–4 groups; no ambiguous repeated captures, empty alternation, or undefined unmatched-group output.

**Difficulty.** One group; several groups; optional outer context; nested numbering; unanchored leftmost match.

**Feedback.** Color-code group spans.

**Examples.**

1. `^([a-z]+)=([0-9]+)$` on `port=8080` → group1 `port`, group2 `8080`. L1.
2. `([0-9]{2})-([0-9]{2})` on `x12-34y` → whole `12-34`, groups `12`,`34`. L2.
3. `^((ab)+)(c)$` on `ababc` → group1 `abab`, group2 final captured `ab`, group3 `c`. L4.

**Validation.** Tagged matcher plus reference-tool fixtures for every generated AST shape.

### Family `regex_replacement_result`

**Learner task.** Predict a regex replacement using whole-match or backreferences.

**Response mode.** Text.

**Question template.** `Replace using pattern {pattern}, replacement {replacement}, mode {first_or_global}: {text}.`

**Answer derivation.** Find matches left to right, substitute `&` and numbered captures, and prevent overlap.

**Instance constraints and rejection rules.** Nonempty matches for global replacement; escape syntax rendered unambiguously.

**Difficulty.** Literal replacement; whole match; capture reorder; multiple matches; surrounding unmatched text.

**Feedback.** Show each replacement expansion.

**Examples.**

1. `[0-9]+` → `#` in `id=42` → `id=#`. L1.
2. `([a-z]+)=([0-9]+)` → `\2:\1` in `port=80` → `80:port`. L2.
3. global `([0-9]+)` → `[\1]` in `a1b22` → `a[1]b[22]`. L3.

**Validation.** Same substitution engine as sed family.

### Family `glob_regex_contrast`

**Learner task.** Compare whether a pattern matches under shell-glob and POSIX-ERE semantics.

**Response mode.** Two yes/no fields or matching-set comparison.

**Question template.** `For text/path {candidate}, does {pattern} match as (a) shell glob and (b) POSIX ERE?`

**Answer derivation.** Evaluate with two distinct AST interpreters and the declared whole-string/substring context.

**Instance constraints and rejection rules.** Pattern valid in both syntaxes when direct comparison is requested, or syntax validity itself is explicit.

**Difficulty.** `?`; `.`; `*`; brackets; anchors/leading dot.

**Feedback.** Explain the different meaning of the decisive character.

**Examples.**

1. pattern `a?c`, candidate `ac` → glob no (`?` requires one character); ERE yes (`a` is optional and the whole text matches). L2.
2. pattern `a.c`, candidate `abc` → glob no (`.` literal); ERE yes. L2.
3. pattern `a*.txt`, candidate `b.txt` → glob no; ERE yes by matching `.txt` with `a*` empty and `.` as the wildcard. L3.

**Validation.** Separate parsers; examples must state ERE substring versus anchored whole-string mode.

## 6. Category: Permissions and filesystem state

### Category purpose

Train exact reasoning about access bits, directory operations, link resolution, and storage state.

### Learn

Permissions are checked by one applicable class: owner, else matching group, else other. Directory permissions describe operations on names:

- `r`: list names;
- `x`: traverse a known name;
- `w+x`: create/remove entries.

`umask` removes bits from a requested mode. Hard links share an inode; symbolic links store another path.

### Prerequisites

Octal bits and directory trees.

### Subcategories

1. Mode representation
2. Mode transitions
3. Access decisions
4. Directory semantics
5. Links and storage

### Family `permission_mode_conversion`

**Learner task.** Convert between octal and symbolic Unix modes.

**Response mode.** Octal or fixed-width symbolic mode.

**Question template.** `Convert mode {mode} to {target_representation}.`

**Answer derivation.** Map `r=4,w=2,x=1` per owner/group/other; apply setuid/setgid/sticky display rules for advanced forms.

**Instance constraints and rejection rules.** Exactly 3 permission triads; file-type character omitted or separately labeled.

**Difficulty.** Simple octal; mixed triads; inverse; leading zero; special bits with `s/S/t/T`.

**Feedback.** Show three independent bit sums.

**Examples.**

1. `0754` → `rwxr-xr--`. L1.
2. `rw-r-----` → `0640`. L1.
3. regular executable `4755` → `rwsr-xr-x`. L4.

**Validation.** Bitwise encode/decode round-trip.

### Family `chmod_mode_transition`

**Learner task.** Apply numeric or symbolic `chmod` to an existing mode.

**Response mode.** Four-digit octal.

**Question template.** `Starting mode {initial}, apply chmod {mode_expression}. What is the result?`

**Answer derivation.** Numeric mode replaces permission/special bits; symbolic clauses select classes and add/remove/set bits left to right.

**Instance constraints and rejection rules.** Symbolic subset `ugoa`, `+−=`, `rwx`, and controlled class copying; effect of omitted `who` appears only with an explicit umask rule.

**Difficulty.** Numeric replace; one symbolic clause; comma clauses; `=` clearing unspecified bits; class copy/special bit.

**Feedback.** Show affected triads after each clause.

**Examples.**

1. `0644`, `g+w` → `0664`. L1.
2. `0755`, `go-w,u-x` → `0655`. L2.
3. `0644`, `g+w,o-r` → `0660`. L3.

**Validation.** Mode-bit interpreter and system-fixture comparison at build time.

### Family `umask_creation_mode`

**Learner task.** Compute a new file/directory mode from requested mode and umask.

**Response mode.** Four-digit octal.

**Question template.** `{object_type} requests mode {requested}; umask is {umask}. What mode is created?`

**Answer derivation.** `actual = requested & ~umask` over permission bits.

**Instance constraints and rejection rules.** Requested regular-file mode normally `0666`, directory `0777`; special bits excluded.

**Difficulty.** Common `022`; different group/other masks; directory execute; nonstandard requested mode; inverse missing umask bits.

**Feedback.** Show requested, mask, and retained bits by triad.

**Examples.**

1. file `0666`, umask `0022` → `0644`. L1.
2. directory `0777`, umask `0027` → `0750`. L2.
3. file `0660`, umask `0007` → `0660`. L3.

**Validation.** Bitwise oracle.

### Family `file_access_decision`

**Learner task.** Decide whether a modeled process may read, write, or execute an inode.

**Response mode.** Yes/no plus selected permission class.

**Question template.** `Process {identity} requests {operation} on {inode_metadata}. Is it allowed?`

**Answer derivation.** Select owner, group, or other class by identity precedence, then test the requested bit.

**Instance constraints and rejection rules.** Nonprivileged user; no ACL/capability; traversal to the inode already granted.

**Difficulty.** Owner; supplementary group; other; owner-class precedence trap; several operations.

**Feedback.** First identify the selected triad, then the bit.

**Examples.**

1. mode `0640`, owner alice, group ops; alice reads → yes via owner `r`. L1.
2. same file; bob in ops writes → no via group `r--`. L2.
3. mode `0004`, owner alice; alice reads → no: owner bits apply, not other bits. L4.

**Validation.** Identity-class oracle and exhaustive mode tests.

### Family `directory_operation_access`

**Learner task.** Determine whether listing, traversal, creation, or removal is permitted by directory modes.

**Response mode.** Yes/no with required bits.

**Question template.** `Given {path_modes}, may {identity} perform {directory_operation}?`

**Answer derivation.** Require `x` on each traversed directory; apply `r` for listing or `w+x` on parent for entry mutation; apply sticky rule if set.

**Instance constraints and rejection rules.** No ACLs, read-only mounts, immutable flags, or open-file complications.

**Difficulty.** List versus traverse; create; remove read-only file; missing ancestor `x`; sticky directory ownership.

**Feedback.** Evaluate path components and parent-entry operation separately.

**Examples.**

1. directory mode `r--`, known child name, no `x` → cannot access child. L2.
2. parent grants `wx`; target regular file is mode `0444` → entry may be removed if sticky rule does not block it. L3.
3. sticky world-writable directory; bob tries to remove alice’s file and owns neither directory nor file → denied. L4.

**Validation.** Path access simulator with targeted truth table.

### Family `symlink_path_resolution`

**Learner task.** Resolve a path through relative/absolute symbolic links or identify a dangling/loop result.

**Response mode.** Final path/inode or status.

**Question template.** `In {filesystem}, resolve {path} following symlinks.`

**Answer derivation.** When a symlink is encountered, replace it with its target; resolve relative targets against the symlink’s containing directory; continue with remaining components; enforce hop limit.

**Instance constraints and rejection rules.** 0–4 links; explicit follow/no-follow final component; no mount crossings.

**Difficulty.** Absolute link; relative link; link plus remaining suffix; dangling link; loop.

**Feedback.** Show each substituted path.

**Examples.**

1. `/srv/current → /srv/releases/v2`; resolve `/srv/current/app` → `/srv/releases/v2/app`. L1.
2. `/srv/current → releases/v2`; same result because target is relative to `/srv`. L2.
3. `/a → /b`, `/b → /a`; resolve `/a/x` → symlink loop error. L3.

**Validation.** Path resolver with visited/hop checks.

### Family `hard_link_inode_trace`

**Learner task.** Track directory entries, inode link counts, and data lifetime across link/unlink operations.

**Response mode.** Named inode/link-count fields.

**Question template.** `Starting from {filesystem_state}, apply {link_operations}. What remains?`

**Answer derivation.** Hard-link creation adds a directory entry to the same inode and increments link count; unlink removes an entry and decrements; data is reclaimed at link count zero when no open-handle exception is modeled.

**Instance constraints and rejection rules.** Regular files on one filesystem; no directory hard links; open descriptors excluded initially.

**Difficulty.** Create link; remove original name; several links; rename versus link; final reclamation.

**Feedback.** Draw names pointing to inode IDs.

**Examples.**

1. `a` points inode 10 count1; link `b` to `a` → both names inode10, count2. L1.
2. then unlink `a` → `b` still accesses data, count1. L2.
3. unlink final `b` → inode/data reclaimed. L2.

**Validation.** Directory/inode graph invariants.

### Family `storage_capacity_constraint`

**Learner task.** Decide whether an operation fits available data blocks and inodes, and update both counts.

**Response mode.** Yes/no plus remaining integer fields.

**Question template.** `Filesystem has {free_blocks} blocks and {free_inodes} inodes. Operation {operation} requires {requirements}. Does it succeed?`

**Answer derivation.** Require sufficient counts in every independent resource; subtract on success only.

**Instance constraints and rejection rules.** Requirements explicit; no journaling, metadata-block, sparse-file, quota, or delayed-allocation effects.

**Difficulty.** Block-limited; inode-limited; sequence of creates/deletes; hard link consumes directory metadata but no new file inode under simplified model; mixed operations.

**Feedback.** Show a two-resource ledger.

**Examples.**

1. free blocks 100, inodes 0; create empty file needing one inode → fails. L1.
2. free blocks 3, inodes 5; create file needing 4 blocks/1 inode → fails. L1.
3. free 10 blocks/3 inodes; create requirements `(4,1)` then `(7,1)` → first succeeds, second fails; remaining `(6,2)`. L3.

**Validation.** Resource-ledger simulator.

## 7. Category: Processes and lifecycle

### Category purpose

Train interpretation of process tables and deterministic state transitions without interacting with real processes.

### Learn

A PID names a process, but process selection should also consider user, command, parent, and state. `SIGTERM` requests termination and may be handled; `SIGKILL` cannot be caught; `SIGSTOP` stops and `SIGCONT` resumes. A terminated child becomes a zombie until its parent reaps it in the simplified model.

### Prerequisites

Exit status and table filtering.

### Process model

States are running/runnable `R`, sleeping `S`, stopped `T`, and zombie `Z`. Each synthetic process declares its disposition for `TERM`; `KILL`, `STOP`, and `CONT` use fixed modeled behavior. Threads, sessions, process groups, terminals, priorities, and races are excluded initially.

### Family `process_table_selection`

**Learner task.** Select processes matching declared `ps`/`pgrep`-like criteria.

**Response mode.** Unordered PID set.

**Question template.** `From {process_table}, select processes where {criteria}.`

**Answer derivation.** Apply exact user, parent, state, and full-command/name predicates.

**Instance constraints and rejection rules.** Criteria semantics displayed; substring versus exact-name explicit; PIDs unique.

**Difficulty.** One field; conjunction; name versus full command; parent subtree; negated state.

**Feedback.** Mark pass/fail per row and criterion.

**Examples.**

1. select user `alice` from PIDs 10(alice),11(root),12(alice) → `{10,12}`. L1.
2. rows `20:(PPID10,S)`, `21:(PPID10,Z)`, `22:(PPID11,R)`; select `PPID=10` and state not Z → `{20}`. L2.
3. exact process name `worker` does not match `worker-helper` unless full-command substring mode is stated. L3.

**Validation.** Table predicate AST.

### Family `process_signal_transition`

**Learner task.** Predict process state after a modeled signal.

**Response mode.** State/status choice.

**Question template.** `Process {process_state} receives {signal}. What happens in this model?`

**Answer derivation.** Apply declared disposition for TERM or fixed KILL/STOP/CONT rule.

**Instance constraints and rejection rules.** No signal races or pending-mask semantics; invalid transitions become explicit no-op/error choices. Terminating-signal questions either ask only for the termination disposition or declare an auto-reaping supervisor; zombie creation belongs to the lifecycle family.

**Difficulty.** STOP/CONT; default TERM; ignored/handled TERM; KILL override; already zombie.

**Feedback.** State whether the signal can be caught and the resulting state.

**Examples.**

1. running process receives STOP → state T. L1.
2. stopped process receives CONT → runnable/running R. L1.
3. process ignores TERM then receives KILL → TERM leaves it alive; KILL terminates it. L3.

**Validation.** Finite-state transition table.

### Family `process_parent_child_lifecycle`

**Learner task.** Trace child exit, zombie creation, reaping, or simplified reparenting.

**Response mode.** Updated process table fields.

**Question template.** `Given {process_tree}, apply {lifecycle_events}. What are the resulting PPIDs/states?`

**Answer derivation.** Exited child becomes Z while parent exists and has not waited; wait removes it; parent exit reparents live children to PID 1 in this model.

**Instance constraints and rejection rules.** Small tree; no subreapers, double-fork daemon rules, threads, or concurrent event ambiguity.

**Difficulty.** Child exit; wait/reap; parent exits first; mixed live/zombie children; event sequence.

**Feedback.** Show tree/table after each event.

**Examples.**

1. child 20 exits; parent 10 has not waited → PID20 state Z. L1.
2. parent10 then waits for20 → PID20 removed. L2.
3. parent10 exits while live child20 remains → child20 PPID becomes1. L2.

**Validation.** Process-tree invariant and event simulator.

## 8. Category: Networking and services

### Category purpose

Train exact reasoning across address, route, name, socket, and application layers.

### Learn

CIDR divides an address into prefix and host bits. Routing chooses the most specific matching prefix. DNS maps names through displayed records. A route to a host does not imply a service is listening, and a listening socket does not imply the HTTP path exists.

### Prerequisites

Binary masks, powers of two, and client/server vocabulary.

### Subcategories

1. IPv4 subnets
2. Routes
3. URLs and DNS
4. Listening sockets
5. HTTP routing

### Family `ipv4_cidr_properties`

**Learner task.** Derive mask, network, broadcast, usable range, or ordinary host count from IPv4 CIDR.

**Response mode.** Multiple named fields.

**Question template.** `For {address}/{prefix}, give {requested_properties}.`

**Answer derivation.** Convert to 32 bits; mask prefix bits; network=`address AND mask`; broadcast sets host bits; ordinary usable count=`2^(32-prefix)-2`.

**Instance constraints and rejection rules.** Prefix `/8`–`/30` initially; network/broadcast terminology for conventional subnets.

**Difficulty.** Octet boundary; final-octet block; prefix crossing octet; host range; inverse prefix from mask.

**Feedback.** Show mask and block size in the decisive octet.

**Examples.**

1. `192.168.1.42/24` → network `.0`, broadcast `.255`, 254 usable. L1.
2. `192.168.10.77/26` → network `.64`, broadcast `.127`, usable `.65–.126`, 62. L3.
3. `10.0.5.9/20` → network `10.0.0.0`, broadcast `10.0.15.255`, 4094. L4.

**Validation.** Unsigned 32-bit integer oracle and boundary tests.

### Family `subnet_membership`

**Learner task.** Decide which addresses share a declared subnet or find a missing prefix threshold.

**Response mode.** Multiple-choice set or integer prefix.

**Question template.** `Which addresses belong to {subnet}?`

**Answer derivation.** Mask each candidate and compare its network prefix.

**Instance constraints and rejection rules.** Distinguish membership from ordinary host usability when network/broadcast candidates appear.

**Difficulty.** Same /24; block boundary; network/broadcast distinction; several candidates; most-specific common prefix.

**Feedback.** Show masked prefix for each candidate.

**Examples.**

1. `192.168.1.0/24`: `.5` yes, `192.168.2.5` no. L1.
2. `172.16.4.0/22` includes third octets 4–7, not 8. L3.
3. `10.0.0.0/30`: `.0–.3` are members, but only `.1,.2` are ordinary usable hosts. L3.

**Validation.** Bit-mask membership and usable-host distinction.

### Family `route_table_selection`

**Learner task.** Select the route used for a destination.

**Response mode.** Route/interface choice.

**Question template.** `Given {route_table}, which route handles {destination}?`

**Answer derivation.** Filter matching prefixes, choose greatest prefix length, then lowest metric for equal prefix.

**Instance constraints and rejection rules.** Routes synthetically valid; next-hop reachability not part of selection unless explicitly added.

**Difficulty.** Default only; connected plus default; overlapping prefixes; equal-prefix metric; no matching route when no default.

**Feedback.** List matching routes and highlight longest prefix.

**Examples.**

1. routes `0.0.0.0/0→wan`, `10.0.0.0/8→lan`; destination `10.3.4.5` → lan. L1.
2. add `10.2.0.0/16→vpn`; destination `10.2.3.4` → vpn. L2.
3. two `10.2.0.0/16` routes metrics 100 and20 → metric20 route. L3.

**Validation.** Integer prefix matcher and deterministic ranking.

### Family `url_endpoint_parse`

**Learner task.** Extract URL components and effective network endpoint.

**Response mode.** Named fields.

**Question template.** `Parse {url}: scheme, host, effective port, path, query, fragment, and request target.`

**Answer derivation.** Parse controlled absolute URL grammar; apply scheme default port; request target is path plus optional query and excludes fragment.

**Instance constraints and rejection rules.** Valid absolute HTTP(S) URLs; userinfo excluded; percent-decoding not performed unless explicit.

**Difficulty.** Default port; explicit port; query; fragment; bracketed IPv6 recognition.

**Feedback.** Color each lexical component and distinguish browser-only fragment.

**Examples.**

1. `http://example.test/a` → host `example.test`, port80, path `/a`. L1.
2. `https://api.test:8443/v1?q=x#top` → port8443, request target `/v1?q=x`, fragment `top`. L3.
3. `https://example.test` → path/request target `/`, port443. L2.

**Validation.** Controlled URL parser and reserialization properties.

### Family `dns_resolution_chain`

**Learner task.** Follow displayed DNS records/cache entries to a final address or error.

**Response mode.** Ordered names plus final address/status.

**Question template.** `Using only this synthetic DNS data {records}, resolve {query_name} type {query_type}.`

**Answer derivation.** Follow CNAME targets with loop/hop checks, then return matching A/AAAA record or declared NXDOMAIN/no-data result.

**Instance constraints and rejection rules.** No real DNS, search domains, referrals, DNSSEC, round-robin timing, or unspecified cache behavior.

**Difficulty.** Direct A; one CNAME; chain; missing terminal record; loop/cache override.

**Feedback.** Show each queried owner/type.

**Examples.**

1. `app.test A 192.0.2.10` → direct `192.0.2.10`. L1.
2. `www.test CNAME app.test`, then A above → chain `www→app`, final address. L2.
3. `a CNAME b`, `b CNAME a` → CNAME loop error. L3.

**Validation.** Typed-record graph traversal.

### Family `listening_socket_match`

**Learner task.** Decide which listener, if any, accepts a local destination tuple in the simplified model.

**Response mode.** Listener choice/status.

**Question template.** `Host owns {local_addresses} and has {listeners}. Which listener matches {protocol,destination_address,port}?`

**Answer derivation.** Match protocol and port, then require either the exact local destination address or the wildcard address; loopback destination remains local-only.

**Instance constraints and rejection rules.** Exactly zero or one listener may match. Do not generate a conflicting exact-address and wildcard listener for the same protocol/port. No `SO_REUSEPORT`, dual-stack ambiguity, firewall, NAT, or established-connection state.

**Difficulty.** Exact listener; wrong port/protocol; wildcard; loopback versus external address; several nonconflicting listeners.

**Feedback.** Compare the three tuple components.

**Examples.**

1. listener TCP `0.0.0.0:80`; destination local `192.0.2.5:80` → matches. L1.
2. listener TCP `127.0.0.1:8080`; remote client targeting `192.0.2.5:8080` → no match. L2.
3. UDP `0.0.0.0:53` does not match a TCP connection to port53. L2.

**Validation.** Socket tuple matcher.

### Family `http_route_response`

**Learner task.** Determine a modeled HTTP response status from method, path, authentication state, and a small route table.

**Response mode.** Integer status plus route choice.

**Question template.** `Server rules are {routes}. What status results from {request}?`

**Answer derivation.** Match path, then allowed method and declared auth precondition; use the route table’s explicit fallback ordering.

**Instance constraints and rejection rules.** Status behavior fully declared; no framework-dependent automatic redirects/content negotiation.

**Difficulty.** Existing GET; created POST; wrong method; auth required; missing route versus method failure.

**Feedback.** Show which routing predicate first fails.

**Examples.**

1. route `GET /health→200`; request `GET /health` → 200. L1.
2. route `/jobs` allows POST→201; `GET /jobs` → declared 405. L2.
3. `GET /admin` requires auth; unauthenticated request → declared 401. L2.

**Validation.** Route-table decision AST.

## 9. Category: Operational safety and troubleshooting

### Category purpose

Train robust argument handling and identification of the first failed layer from exact observations.

### Learn

Safe shell work separates data from syntax:

- quote expansions;
- use `--` before path operands that may begin with `-`;
- use NUL-delimited records for arbitrary filenames;
- inspect scope before mutation;
- prefer graceful termination before forced termination.

Troubleshoot from lower dependencies upward: name → route → connection/listener → TLS → HTTP/application.

### Prerequisites

All earlier categories.

### Family `robust_command_choice`

**Learner task.** Choose the command form that preserves intended arguments for adversarial but valid input.

**Response mode.** Single-choice.

**Question template.** `Given {input_constraints}, which command safely performs {non_destructive_task}?`

**Answer derivation.** Construct desired argv/data records, then select quoting, `--`, and delimiter mechanisms that produce them.

**Instance constraints and rejection rules.** Tasks are non-destructive (print, hash, inspect, archive in simulation); choices differ by a recognizable robustness issue.

**Difficulty.** Space in variable; leading hyphen; glob metacharacters; newline filename; find/xargs NUL pipeline.

**Distractors.** Unquoted expansion, parsing `ls`, newline-only pipeline, missing `--`, or treating data as shell code.

**Feedback.** Show a counterexample filename and the argv each choice would produce.

**Examples.**

1. filename variable may contain spaces → choose `sha256sum -- "$file"`. L1.
2. pattern is literal user data → choose `grep -F -- "$pattern" "$file"`. L2.
3. arbitrary filenames from find → choose `find … -print0 | xargs -0 -r sha256sum --`. L4.

**Validation.** Adversarial fixture corpus including spaces, tabs, newlines, leading `-`, `*`, and quotes.

### Family `first_failed_layer`

**Learner task.** Identify the first network/service layer contradicted by a sequence of observations.

**Response mode.** Single-choice layer.

**Question template.** `Given observations {diagnostic_results}, what is the first failed layer in the declared dependency chain?`

**Answer derivation.** Evaluate name resolution, route selection, connection, TLS, then HTTP in order; choose the earliest failed check, without inventing an unobserved root cause.

**Instance constraints and rejection rules.** Observations internally consistent; asks for failed layer, not unique real-world cause; commands/diagnostics are synthetic.

**Difficulty.** DNS failure; no route; connection refused; TLS failure after TCP; HTTP application status after successful transport.

**Feedback.** Mark established layers and stop at first failure.

**Examples.**

1. DNS query returns NXDOMAIN → name-resolution layer. L1.
2. DNS resolves and route exists, TCP reports connection refused → connection/listener layer. L2.
3. TCP connects, TLS certificate validation fails, no HTTP response → TLS layer. L3.

**Validation.** Dependency-state generator prevents contradictory later successes after an earlier hard failure.

## 10. Cross-family progression

Recommended introduction order:

1. lexical paths and literal argument vectors;
2. quoting and pathname expansion;
3. redirection, then pipelines and statuses;
4. `grep`, `cut`, `sort`, `uniq`, and `wc`;
5. regex recognition before regex construction;
6. `sed` captures and controlled `awk`;
7. `find` before `xargs`, with robust filename handling;
8. permission representation and `umask`;
9. access decisions and directory semantics;
10. symbolic/hard links and storage resources;
11. process selection, signals, and lifecycle;
12. CIDR and subnet membership;
13. routes, URLs, DNS, sockets, and HTTP;
14. robust command choice and layered troubleshooting.

Interleave paired distinctions after direct mastery:

- quoted versus unquoted expansion;
- glob versus regex;
- stdout versus stderr;
- pipeline output versus pipeline status;
- lexical versus physical path;
- file contents versus directory entry;
- symbolic versus hard link;
- reachability versus listening service;
- TCP success versus HTTP success.

## 11. Adaptive practice guidance

Track mastery by family and by semantic dimension:

- expansion stage and quote context;
- glob operator, dotfile, match count, and unmatched policy;
- descriptor, redirection order, append/truncate;
- command-list operator and status pattern;
- utility/option and record shape;
- BRE/ERE/glob distinction (BRE is recognition-only unless later enabled);
- regex operator, anchoring, and capture shape;
- permission class, requested operation, and directory/file type;
- symlink target kind and link depth;
- block/inode limiting resource;
- process criterion/signal/lifecycle event;
- CIDR decisive octet, membership boundary, and route tie;
- DNS/socket/HTTP layer;
- robustness hazard.

Failure routing:

| Error pattern | Next practice |
|---|---|
| quotes appear in proposed argv | quote-removal argument-vector item |
| quoted variable splits | quoted/unquoted minimal pair |
| `*.log` includes `.hidden.log` | leading-dot glob diagnostic |
| unmatched glob disappears | nullglob-off contrast |
| stderr assumed to enter every pipe | stdout/stderr routing item |
| treats `2>&1 >f` like `>f 2>&1` | redirection-order pair |
| `A || B && C` grouped with precedence | left-associative execution trace |
| `uniq` removes nonadjacent duplicates | same input before/after sort |
| `wc -l` counts visible text rows | missing-final-newline diagnostic |
| uses regex syntax in `find -name` | glob/ERE contrast |
| misses regex anchors | positive substring and negative whole-string pair |
| chmod merges owner/group/other permissions | triad conversion |
| owner borrows permissive “other” bits | class-precedence diagnostic |
| file write bit used for deletion | parent-directory removal item |
| relative symlink resolved from cwd | symlink-parent resolution pair |
| free blocks imply create success | zero-inode diagnostic |
| TERM and KILL treated identically | caught/ignored TERM then KILL |
| host membership confused with usable host | network/broadcast candidate |
| chooses first route rather than longest prefix | overlapping route table |
| loopback listener treated as externally reachable | listener-address contrast |
| HTTP 404 blamed on routing/DNS | layered success trace through HTTP |
| unsafe choice selected | replay with adversarial filename and argv |

Recommended adaptive mix: 40% weakest misconception/dimension, 25% spaced mastery, 20% contrast pairs, 10% inverse/construction questions, and 5% combined troubleshooting.

## 12. Feedback and visualization requirements

Use the smallest visualization that exposes the mechanism:

- numbered argument boxes for `argv`;
- expansion-stage tables;
- descriptor arrows for redirection;
- stream snapshots between pipeline stages;
- highlighted records/fields/matches;
- permission triads and selected identity class;
- directory-entry-to-inode diagrams;
- process tables/trees;
- 32-bit or decisive-octet CIDR diagrams;
- ordered layer stack for troubleshooting.

All control characters and unusual filename bytes require a reversible escaped display. Never render a newline-containing filename as if it were two files.

Worked solutions must describe the modeled semantics, not claim that an actual shell was run.

## 13. Implementation requirements

- controlled ASTs for shell words, command lists, redirections, utilities, regexes, find predicates, and diagnostic dependencies;
- byte-oriented virtual files with explicit final-newline metadata;
- virtual inode/directory-entry graph;
- exact UID/GID/group and permission checks;
- deterministic process state machine;
- unsigned 32-bit IPv4 helpers;
- typed DNS records, routes, sockets, and HTTP rule tables;
- POSIX-ERE subset engine or semantic AST matcher with build-time reference fixtures;
- deterministic seeded generation;
- structural signatures independent of cosmetic filenames/PIDs/addresses;
- backward generation for targeted collisions, permission traps, boundary CIDRs, and diagnostic failure layers;
- local JavaScript only at runtime;
- no interpolation of learner input into an executable command.

Reference-tool comparison at build time must set the declared locale/options and operate only on disposable fixtures. A reference mismatch blocks the affected generator family.

## 14. Automated validation

- Round-trip command lexing/formatting for the supported grammar.
- Compare word expansion and glob fixtures with the declared Bash configuration.
- Exhaust dotfile, unmatched-pattern, quoting, empty-variable, and multi-field cases.
- Verify descriptor routing and file truncation/append effects with an independent FD simulator.
- Exhaust status combinations for `&&`, `||`, `;`, pipeline, and pipefail.
- Test each utility transform independently and in random pipelines.
- Compare curated GNU tool fixtures for every supported flag combination.
- Ensure `uniq` only groups adjacent records and `wc` counts exact bytes/newlines.
- Validate every regex AST against positive/negative corpora and reference tools.
- Ensure each constructed-regex choice has exactly one valid answer.
- Exhaust ordinary permission modes and identity classes.
- Test symbolic chmod clauses, class copying, and special-bit display.
- Verify umask via bitwise oracle.
- Property-test directory access and sticky rules.
- Verify symlink resolution, dangling links, loops, and relative targets.
- Assert inode/link-count consistency after every operation.
- Test independent block/inode exhaustion.
- Exhaust process transition table and lifecycle invariants.
- Property-test IPv4 masks, network/broadcast, membership, and usable counts.
- Verify route selection by independently sorting matching route candidates.
- Round-trip controlled URL parsing.
- Validate DNS chains, missing data, and loops.
- Test listener tuple matching across address/protocol/port.
- Ensure HTTP rule tables produce one deterministic status.
- Run adversarial filenames through every robust-command choice.
- Ensure layered diagnostic states are internally consistent.
- Test at least 10,000 seeds per family/level for ambiguity, degeneration, duplicate structure, and rendering overflow.

## 15. Coverage requirements

- Quoted and unquoted parameter expansions remain balanced.
- Dotfiles, unmatched globs, and option-like filenames recur deliberately.
- Both redirection orders appear often enough to preserve the distinction.
- Pipeline output and pipeline status receive separate practice.
- Text-tool practice emphasizes composable core behavior over flag trivia.
- Every supported utility has selection, empty-result, and boundary fixtures.
- Regex practice balances matches/nonmatches and anchored/unanchored patterns.
- Glob-versus-regex contrast recurs across shell, `find`, and grep contexts.
- Permission practice covers all identity classes and file/directory distinctions.
- Symlink, hard-link, block, and inode concepts each receive direct practice.
- TERM/STOP/CONT/KILL and zombie/reap behavior all recur.
- CIDR practice spans octet-aligned and nonaligned prefixes.
- Routes include overlapping prefixes and metric ties.
- DNS, socket, and HTTP failures are not conflated.
- Safety questions include spaces, newlines, leading hyphens, and metacharacters.
- Combined questions introduce at most one unmastered hazard.
- Recent structural signatures suppress cosmetic repeats.

## 16. Topic-level quality checklist

- [ ] Every question names the shell/tool/platform model needed for one answer.
- [ ] No generated question executes a real command.
- [ ] The shell subset is explicit rather than “whatever JavaScript approximates.”
- [ ] Quotes, expansion stages, and final argv remain distinct.
- [ ] Globs and regular expressions are never conflated.
- [ ] Redirections are processed left to right.
- [ ] Pipeline data and status are trained separately.
- [ ] Utility output is checked byte-for-byte where meaningful.
- [ ] Regex syntax is explicitly POSIX ERE.
- [ ] File, directory, symlink, and hard-link semantics remain distinct.
- [ ] Permission checks use exactly one identity class.
- [ ] `umask` only removes bits.
- [ ] Directory removal checks the parent entry permissions.
- [ ] Processes/signals use a declared deterministic model.
- [ ] CIDR and routing use exact 32-bit arithmetic.
- [ ] DNS, TCP/listener, TLS, and HTTP layers remain separate.
- [ ] Robust forms quote data and protect option operands.
- [ ] Dangerous habits appear only as diagnosed distractors, never recommended defaults.
- [ ] Every family has three examples, constraints, feedback, and automated validation.
- [ ] The standalone app requires no backend or external package.

## 17. Stable navigation

Recommended learner-facing categories:

- Shell Words & Paths
- Streams & Status
- Text Tools
- Regular Expressions
- Permissions & Filesystems
- Processes
- Networking & Services
- Safety & Troubleshooting

Stable family identifiers are the backticked identifiers above. Track progress at family, dialect feature, misconception, and representation level; one aggregate “admin” score would hide important weaknesses.
