# Deploy

The output is static: `npm run build` writes `dist/`, which includes `install.sh` and `install.ps1` copied from `public/`.

Any static host works (Cloudflare Pages, Netlify, GitHub Pages, S3 + CDN, nginx).

## Requirements

- Serve over HTTPS. The install commands embed the page's own origin, so `curl … | bash` is only as safe as the transport.
- Serve `install.sh` as `text/plain` or `text/x-shellscript` and `install.ps1` as `text/plain`, with no HTML fallback for those two paths. A single-page-app rewrite must not catch them.
- Keep `.sh` files LF (`.gitattributes` enforces it). A CRLF script fails under bash.

## Before publishing

```text
npm run build
npm run check:install
curl -fsSL https://YOUR-HOST/install.sh | head -n 3     # must print the bash shebang, not HTML
```

Then run the installers on a clean Linux, macOS and Windows machine. This has not been done yet.

## Pinning a release

`JARVIS_REF` selects a branch, tag or commit and defaults to `main`. Once tagged releases exist, change the default to the latest tag and, when prebuilt archives are public, switch the scripts to download and verify the SHA-256 instead of building.
