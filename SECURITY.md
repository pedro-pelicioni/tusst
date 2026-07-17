# Security Policy

TUSST doesn't ship versioned releases — only `main` is meaningful, so there
are no "supported versions" beyond it.

## Reporting a vulnerability

Please use GitHub's **private vulnerability reporting** instead of a public
issue: go to the [Security tab](https://github.com/pedro-pelicioni/tusst/security)
and click **"Report a vulnerability."** That sends the report directly and
privately to the maintainer — it's the preferred channel and doesn't require
sharing any contact detail publicly.

We'll acknowledge reports as soon as we see them and keep you posted while a
fix is worked out. Please don't open a public issue or PR for anything that
could be actively exploited before a fix ships.

## Scope

The highest-impact surface in this project is the **untrusted code execution
sandbox**: `runner/` and `runner-soroban/` define the Docker isolation used to
compile and run submitted Rust/Soroban code (`--network none`, `--cap-drop
ALL`, non-root user, resource/time limits, one throwaway container per run).
A regression there — e.g. a dropped isolation flag — is a sandbox escape
running on the production host, and is the category of report we most want
to hear about quickly.

`.mcp.json` declares a remote MCP server (`stellar-raven`) as the only
third-party trust surface checked into this repo. If you find a concern with
that dependency specifically, it's worth flagging too.

## What's out of scope

- Findings that require physical access to the deployment host.
- Missing security headers or best-practice suggestions with no
  demonstrated impact — feel free to open those as a regular issue instead.
- Automated scanner output without manual verification that it applies here.
