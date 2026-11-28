# Release Publishing

Automated publishing is triggered only by a published GitHub Release (see `.github/workflows/publish.yml`). Normal PRs/merges to `main` do not publish.

## Flow

1. Normal PR merges to `main`.
2. Release Please (`.github/workflows/release-please.yml`) opens/updates a Release PR.
3. Maintainer merges the Release PR.
4. Release Please creates the version, tag, and GitHub Release.
5. The `Publish` workflow runs on `release: published`, builds, packs, verifies version/tag match, then publishes to npm and GitHub Packages.

## Required configuration

- Repository secret `NPM_TOKEN`: npm automation token with publish rights for `make-it-ezy` (or configure npm trusted publishing/OIDC and remove the token).
- `GITHUB_TOKEN` is provided automatically; the workflow needs `packages: write` (declared in the workflow).
- Package metadata: `apps/cli/package.json` name `make-it-ezy`, version must match the release tag.
- GitHub Packages publishes under the scoped name `@ezmichaely/make-it-ezy`.

## Version consistency

Root, `apps/cli`, and `packages/core` are kept at the same version (`0.1.6`). Root and core remain private/internal packages; only `apps/cli` is published. Release Please tracks `apps/cli`.