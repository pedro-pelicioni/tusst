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

## Known advisories we carry on purpose

**`elliptic` <= 6.6.1 — GHSA-848j-6mx2-7j84 (low).** No fix exists: 6.6.1 is
both the latest published version and the vulnerable one, so there is nothing
to upgrade to. `npm audit` reports it 23 times, which is one advisory counted
once per package in the chain, not 23 problems.

It is unreachable in this app. `elliptic` is pulled in only by
`@creit.tech/stellar-wallets-kit`, through two wallet connectors — HOT/NEAR
(`@hot-wallet/sdk` -> `@near-js/crypto` -> `secp256k1`) and Trezor
(`@trezor/connect`). We register neither: `src/lib/stellar/wallet.ts` inits the
kit with `defaultModules()`, whose 12 modules are Albedo, Freighter, Fordefi,
Rabet, xBull, Lobstr, Hana, Klever, OneKey, Bitget, CactusLink and Dcent. The
kit is also imported lazily, so nothing outside that set is ever loaded. Grep
the client bundle after `npm run build` and `elliptic`, `@trezor` and
`near-api-js` are all absent while the kit itself is present — the code is not
merely unused, it is never shipped.

Re-check this if the kit is ever switched to explicit modules that include HOT
or Trezor, or if upstream adds one of them to `defaultModules()`.

`npm audit` suggests "fixing" it by moving `@creit.tech/stellar-wallets-kit`
from 2.5.0 to 1.5.0. That is a major *downgrade* of our wallet layer to drop a
low-severity advisory in code we don't ship — do not take it.
