# Practice Lab

Practice Lab is a collection of small offline practice apps for programmer-adjacent skills. The current app is **Programmer Low-Level Numeracy**: bits, bases, fixed-width integers, masks, shifts, rotations, and endian memory order.

The distributed app is a standalone HTML file:

- `programmer-low-level-numeracy.html`

Open it directly in a browser. Progress is stored locally in the browser with `localStorage`.

## Source Layout

The root HTML file is generated. Edit the source files instead:

- `apps/programmer-low-level-numeracy/template.html`
- `apps/programmer-low-level-numeracy/style.css`
- `apps/programmer-low-level-numeracy/main.js`

Tooling lives in:

- `tools/build.sh`
- `tools/build.mjs`
- `tools/test.sh`
- `tools/test.mjs`

There is no Node/npm dependency chain. The build uses shell plus Bun, with no external packages.

## Build

```sh
tools/build.sh
```

This inlines the app CSS and JavaScript into `programmer-low-level-numeracy.html`.

## Test

```sh
tools/test.sh
```

This rebuilds the app, checks that the inline script parses, and runs the app's browser-console self-tests through Bun.

## Notes

- Keep generated root HTML files committed as easy-to-open app artifacts.
- Put future app ideas and design notes in `FUTURE_WORK.md`.
- If more apps are added, each should get its own source directory under `apps/` and its own generated standalone HTML file.

## License

Practice Lab is released under the MIT License. See `LICENSE`.
