# Release checklist

> Task 015 output. Publishing to npm is an explicit maintainer action. Do not publish automatically.

## Preconditions

- [ ] On intended release commit; working tree clean.
- [ ] `pnpm check:ci` passes.
- [ ] Release version/changelog/tag flow reviewed (release-please PR if used).
- [ ] npm package name ownership/availability for `make-it-ezy` explicitly checked by maintainer.

## Build and inspect artifact

From repo root:

```bash
pnpm --filter ./apps/cli build
pnpm --filter ./apps/cli pack --dry-run
```

For a real tarball inspection:

```bash
tmp=$(mktemp -d)
pnpm --filter ./apps/cli pack --pack-destination "$tmp"
tarball=$(ls "$tmp"/make-it-ezy-*.tgz)
tar -tzf "$tarball" | sort
tar -xOf "$tarball" package/package.json
rm -rf "$tmp"
```

## Required checks

- [ ] Public package name is `make-it-ezy`.
- [ ] Intended executable is `ezy` (`bin.ezy` points to `./dist/index.js`).
- [ ] `LICENSE` is included in the tarball.
- [ ] Bundled runtime core is present under `dist/core/` and `dist/index.js` imports it.
- [ ] `README.md` and `package.json` are present.
- [ ] Packed metadata is acceptable: `devDependencies` should not contain `workspace:*`; pnpm pack currently rewrites to concrete version - verify.
- [ ] No unintended files/secrets in tarball.

## Install smoke (outside repo)

```bash
tmp=$(mktemp -d)
prefix=$(mktemp -d)
work=$(mktemp -d)
pnpm --filter ./apps/cli pack --pack-destination "$tmp"
tarball=$(ls "$tmp"/make-it-ezy-*.tgz)
npm install -g --prefix "$prefix" "$tarball"
PATH="$prefix/bin:$PATH" bash -lc 'cd "'"$work"'" && ezy --help && ezy plan x --local-only'
rm -rf "$tmp" "$prefix" "$work"
```

- [ ] Smoke passes outside repository.

## Publish

- [ ] Maintainer confirms npm auth, package ownership, and 2FA/publish policy.
- [ ] Publish is intentional/manual. Do not publish from CI unless an explicitly approved workflow exists.
- [ ] After publish: `npm view make-it-ezy version` and fresh global install smoke.

## Notes

- `packages/core` is internal workspace package; bundled into CLI artifact, not published separately.
- Do not claim Windows support beyond the focused CI verification documented in `docs/decisions/DECISION-WINDOWS-SUPPORT.md`.
