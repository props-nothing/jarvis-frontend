---
integration: installer-git-shell
status: researched
last_verified: 2026-10-13
selected_spec_version: Git porcelain v1
selected_sdk: none
---

# Frontend source installer: Git and shell contract

## Scope

Make source-install reruns refuse modified/foreign source trees, build the fetched branch/tag/commit on both platforms, and actually syntax-check both shells. No binary distribution, service manager, rustup API or core lifecycle changes.

## Official sources

Accessed 2026-10-13 (UTC):

| Source | URL | Contract |
| --- | --- | --- |
| Git index | https://git-scm.com/llms.txt | Not found (404); use official command reference |
| Git status | https://git-scm.com/docs/git-status/2.53.0 | `--porcelain=v1` is stable across Git versions/user configuration; `--untracked-files=all` includes untracked files |
| Git fetch | https://git-scm.com/docs/git-fetch | Fetch stores fetched refs/objects in `FETCH_HEAD`; without append, replaces the previous fetch record |
| Git checkout | https://git-scm.com/docs/git-checkout | `--detach` checks out a commit; `--force` discards changes (rejected) |
| Git remote | https://git-scm.com/docs/git-remote | The origin URL identifies the existing source remote |
| Git revisions | https://git-scm.com/docs/git-rev-parse | Revisions can be branch names, tags or object IDs |
| Bash | https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html | `-n` parses without execution; `pipefail` propagates pipeline failures |
| PowerShell 5.1 | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-5.1 | Native exit status is `$LASTEXITCODE`; ErrorActionPreference alone is insufficient |
| PowerShell parser | https://learn.microsoft.com/en-us/dotnet/api/system.management.automation.language.parser.parsefile?view=powershellsdk-1.1.0 | ParseFile returns errors separately; the check must explicitly exit non-zero |

Selected validation versions: Git 2.55.0.windows.5, Git Bash 5.3.15, Windows PowerShell 5.1, Node 24.19.0. No SDK or dependency upgrades. Contract uses long-established flags, not new Git features; macOS's Bash 3.2 remains a supported target but is not run in this session.

## Verified contract and boundary

- Git uses the user's existing SSH/HTTPS credentials; the installer takes no secrets. Default source is `https://github.com/props-nothing/jarvis-core.git` (owner-confirmed rename this session). `JARVIS_REPO` explicitly selects a different trusted source; it must match origin on a rerun (one trailing slash normalized). The previous official `jarvisv2.git` HTTPS origin is the sole rename alias; fetch uses the requested URL rather than silently rewriting origin.
- Dirty staged, unstaged and untracked files cause refusal before fetch/build. Existing non-repositories cause refusal. No reset, clean, stash, force or silent origin rewrite.
- Fetch one explicit ref and detach at `FETCH_HEAD` for both fresh clones and updates. Failed fetch must not build stale source. GitHub may refuse arbitrary/unadvertised commit IDs; report Git's error rather than bypassing that.
- Flags for optional service/rustup are exactly `0` or `1`; other values are errors, never interpreted as consent. Service defaults remain off.
- Build and install failures must propagate non-zero and must not print the success message.
- Shell discovery probes the interpreter. Windows prefers installed Git Bash over a nonfunctional WSL stub; missing required shells fail checks, not a silent green skip. Overrides `JARVIS_BASH` and `JARVIS_POWERSHELL` select explicit executables.
- No new remote request, paid operation, protocol or daemon policy is introduced. Installer source and build artifacts live under the user's chosen checkout; no canonical state is changed by the preflight checks. Command execution still requires the user's intentional installer invocation.

## Decisions and rejected alternatives

Adopt conservative refusal and an explicit fetched snapshot. Reject automatic stashing/deleting user work, accepting unrelated origins, service activation for arbitrary nonzero flags, and syntax-check success when an interpreter is unavailable. Ignored build output may remain; custom Cargo target directories are not supported by these scripts.

## Verification plan

Cheapest falsification: dirty a tracked file in a disposable real Git repository, run each installer with a sentinel build command, and assert nonzero exit, no sentinel, unchanged contents/HEAD.

Additional offline real-Git tests: fresh clone, newer branch on rerun, tag/commit selection, wrong origin, untracked/staged source, nonrepo path, missing ref, invalid option values, build failure and install failure. Cargo and the installed binary are disposable fixtures: these tests do not claim to compile JARVIS or register a service. Mutation tests prove malformed shell syntax is rejected. Reuse existing real Ubuntu evidence for the actual build, not as proof of unrun platforms.

## Unresolved questions

Clean-machine AlmaLinux, macOS, ARM Linux and Windows builds remain unverified. Service ownership defects in the core remain recorded separately; these changes do not claim to fix them. No applicable wire pagination, webhook, rate-limit, pricing or SDK deprecation behavior is added.
