# CLI Reference

Complete reference for the `nomos` CLI commands.

## Table of Contents

- [help](#help)
- [login](#login)
- [versions](#versions)
- [capabilities](#capabilities)
- [everything](#everything)
- [new-endpoints](#new-endpoints)
- [operations](#operations)
- [call](#call)
- [oauth-token](#oauth-token)
- [grid-fee-reductions](#grid-fee-reductions)
  - [grid-fee-reductions list](#grid-fee-reductions-list)
  - [grid-fee-reductions get](#grid-fee-reductions-get)
  - [grid-fee-reductions create](#grid-fee-reductions-create)
- [meter-orders](#meter-orders)
  - [meter-orders list](#meter-orders-list)
  - [meter-orders get](#meter-orders-get)
  - [meter-orders create](#meter-orders-create)

---

## help

Display help

```
Usage: nomos help [options]

Display help

Options:
  -h, --help  display help for command
```

## login

Login and persist auth defaults for future nomos commands

```
Usage: nomos login [options]

Login and persist auth defaults for future nomos commands

Options:
  --token <token>           Bearer token
  --client-id <id>          OAuth client id
  --client-secret <secret>  OAuth client secret
  --scope <scope>           OAuth scope string
  -h, --help                display help for command
```

## versions

List available OpenAPI versions

```
Usage: nomos versions [options]

List available OpenAPI versions

Options:
  -h, --help  display help for command
```

## capabilities

Show grouped operation overview and version diff

```
Usage: nomos capabilities [options]

Show grouped operation overview and version diff

Options:
  -v, --version <version>  Spec version (default: "2026-01-29.edison")
  -h, --help               display help for command
```

## everything

Display the full endpoint overview (same as capabilities)

```
Usage: nomos everything [options]

Display the full endpoint overview (same as capabilities)

Options:
  -v, --version <version>  Spec version (default: "2026-01-29.edison")
  -h, --help               display help for command
```

## new-endpoints

Show endpoints that are new in the latest spec compared to the earliest

```
Usage: nomos new-endpoints [options]

Show endpoints that are new in the latest spec compared to the earliest
available spec

Options:
  -h, --help  display help for command
```

## operations

List operation keys

```
Usage: nomos operations [options]

List operation keys

Options:
  -v, --version <version>  Spec version (default: "2026-01-29.edison")
  --tag <tag>              Only show operations with this tag
  -h, --help               display help for command
```

## call

Call an operation by key

```
Usage: nomos call [options] <operation>

Call an operation by key

Arguments:
  operation                    Operation key from `nomos operations`

Options:
  -v, --version <version>      Spec version (default: "2026-01-29.edison")
  --base-url <url>             Base API URL
  --token <token>              Bearer token
  --basic <username:password>  Basic credentials
  --path <json>                Path params JSON object
  --query <json>               Query params JSON object
  --body <json>                Body JSON object
  --set <key=value>            Body param (repeatable)
  --auth <auth>                Auth mode: bearer|basic|none
  -h, --help                   display help for command
```

## oauth-token

Convenience helper for POST /oauth/token

```
Usage: nomos oauth-token [options]

Convenience helper for POST /oauth/token

Options:
  --client-id <id>                OAuth client id
  --client-secret <secret>        OAuth client secret
  --grant-type <grantType>        authorization_code|refresh_token|client_credentials
  --code <code>                   Authorization code
  --refresh-token <token>         Refresh token
  --scope <scope>                 Scopes (space separated)
  --code-verifier <codeVerifier>  PKCE code verifier
  --version <version>             Spec version (default: "2026-01-29.edison")
  --base-url <url>                Base API URL
  -h, --help                      display help for command
```

## grid-fee-reductions

Edison grid fee reductions endpoints

```
Usage: nomos grid-fee-reductions [options] [command]

Edison grid fee reductions endpoints

Options:
  -h, --help        display help for command

Commands:
  list [options]    GET /grid-fee-reductions
  get [options]     GET /grid-fee-reductions/{id}
  create [options]  POST /grid-fee-reductions
  help [command]    display help for command
```

### grid-fee-reductions list

GET /grid-fee-reductions

```
Usage: nomos grid-fee-reductions list [options]

GET /grid-fee-reductions

Options:
  --version <version>          Spec version (default: "2026-01-29.edison")
  --base-url <url>             Base API URL
  --token <token>              Bearer token
  --basic <username:password>  Basic credentials
  --query <json>               Query params JSON object
  -h, --help                   display help for command
```

### grid-fee-reductions get

GET /grid-fee-reductions/{id}

```
Usage: nomos grid-fee-reductions get [options]

GET /grid-fee-reductions/{id}

Options:
  --id <id>                    Grid fee reduction id
  --version <version>          Spec version (default: "2026-01-29.edison")
  --base-url <url>             Base API URL
  --token <token>              Bearer token
  --basic <username:password>  Basic credentials
  -h, --help                   display help for command
```

### grid-fee-reductions create

POST /grid-fee-reductions

```
Usage: nomos grid-fee-reductions create [options]

POST /grid-fee-reductions

Options:
  --set <key=value>             Body param (repeatable)
  --version <version>           Spec version (default: "2026-01-29.edison")
  --base-url <url>              Base API URL
  --token <token>               Bearer token
  --basic <username:password>   Basic credentials
  -h, --help                    display help for command
```
Usage: nomos grid-fee-reductions create [options]

POST /grid-fee-reductions

Options:
  --body <json>                Body JSON object
  --version <version>          Spec version (default: "2026-01-29.edison")
  --base-url <url>             Base API URL
  --token <token>              Bearer token
  --basic <username:password>  Basic credentials
  -h, --help                   display help for command
```

## meter-orders

Edison meter orders endpoints

```
Usage: nomos meter-orders [options] [command]

Edison meter orders endpoints

Options:
  -h, --help        display help for command

Commands:
  list [options]    GET /meter-orders
  get [options]     GET /meter-orders/{id}
  create [options]  POST /meter-orders
  help [command]    display help for command
```

### meter-orders list

GET /meter-orders

```
Usage: nomos meter-orders list [options]

GET /meter-orders

Options:
  --version <version>          Spec version (default: "2026-01-29.edison")
  --base-url <url>             Base API URL
  --token <token>              Bearer token
  --basic <username:password>  Basic credentials
  --query <json>               Query params JSON object
  -h, --help                   display help for command
```

### meter-orders get

GET /meter-orders/{id}

```
Usage: nomos meter-orders get [options]

GET /meter-orders/{id}

Options:
  --id <id>                    Meter order id
  --version <version>          Spec version (default: "2026-01-29.edison")
  --base-url <url>             Base API URL
  --token <token>              Bearer token
  --basic <username:password>  Basic credentials
  -h, --help                   display help for command
```

### meter-orders create

POST /meter-orders

```
Usage: nomos meter-orders create [options]

POST /meter-orders

Options:
  --set <key=value>             Body param (repeatable)
  --version <version>           Spec version (default: "2026-01-29.edison")
  --base-url <url>              Base API URL
  --token <token>               Bearer token
  --basic <username:password>   Basic credentials
  -h, --help                    display help for command
```
Usage: nomos meter-orders create [options]

POST /meter-orders

Options:
  --body <json>                Body JSON object
  --version <version>          Spec version (default: "2026-01-29.edison")
  --base-url <url>             Base API URL
  --token <token>              Bearer token
  --basic <username:password>  Basic credentials
  -h, --help                   display help for command
```

