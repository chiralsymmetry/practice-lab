#!/usr/bin/env sh
set -eu

tools/build.sh
bun tools/test.mjs "$@"
bun apps/cpp-mental-execution/validate.mjs
bun apps/assembly-practice-6502/validate.mjs
bun apps/number-theory-modular-arithmetic/validate.mjs
bun apps/git-version-control/validate.mjs
