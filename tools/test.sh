#!/usr/bin/env sh
set -eu

tools/build.sh
bun tools/test.mjs "$@"
