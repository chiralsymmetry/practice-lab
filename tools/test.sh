#!/usr/bin/env sh
set -eu

tools/build.sh
bun tools/test.mjs "$@"
bun apps/cpp-mental-execution/validate.mjs
bun apps/assembly-practice-6502/validate.mjs
bun apps/assembly-practice-amd64/validate.mjs
bun apps/number-theory-modular-arithmetic/validate.mjs
bun apps/git-version-control/validate.mjs
bun apps/unicode-encodings-text/validate.mjs
bun apps/computer-science/validate.mjs
bun apps/sql-relational-databases/validate.mjs
bun apps/admin-practice/validate.mjs
bun apps/http-web-practice/validate.mjs
bun apps/logic/validate.mjs
bun apps/practical-cryptography/validate.mjs
