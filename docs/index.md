---
layout: home

hero:
  name: "Nomos SDK + CLI"
  text: "TypeScript SDK and CLI for the Nomos Energy API"
  tagline: Build energy management applications with type-safe API access
  image:
    src: /logo.svg
    alt: Nomos Logo
  actions:
    - theme: brand
      text: Get Started
      link: /installation
    - theme: alt
      text: View on GitHub
      link: https://github.com/tn819/nomos-cli

features:
  - title: 🔧 TypeScript SDK
    details: Full type safety with generated types from OpenAPI specs. Import and use in your Node.js or Bun applications.
    link: /sdk/

  - title: ⌨️ Command Line Interface
    details: Interactive CLI for exploring APIs, testing endpoints, and automating workflows. Auto-generated from OpenAPI specs.
    link: /cli/

  - title: 📚 Three Core Use Cases
    details: Checkout flows, invoice explanations, and smart meter orders. Complete with code examples and CLI commands.
    link: /checkout

  - title: 🔐 Flexible Auth
    details: Bearer tokens or OAuth client credentials. Store credentials securely or pass per-command.
    link: /authentication

---

## Quick Start

::: code-group

```bash [CLI]
# Install globally
npm install -g nomos-sdk-cli

# Login and explore
nomos login --token "$NOMOS_TOKEN"
nomos capabilities
```

```typescript [SDK]
import { NomosSDK } from "nomos-sdk-cli";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
});

const plans = await sdk.call("get-plans");
```

:::

## Project Overview

The Nomos SDK provides both a **TypeScript library** and **CLI tool** for interacting with the Nomos Energy API:

- **Auto-generated** from OpenAPI specifications
- **Multi-version support** — Switch between API versions (Batman, Edison)
- **Type-safe** — Full TypeScript types for all operations
- **Well-documented** — CLI help, API reference, and use case guides

## Documentation

<div class="vp-doc">

| Section | Description |
|---------|-------------|
| [Installation](/installation) | Installation and setup instructions |
| [Authentication](/authentication) | Authentication methods and setup |
| [Use Cases](/checkout) | Checkout, invoice, and meter order workflows |
| [SDK Reference](/sdk/) | TypeScript SDK API documentation |
| [CLI Reference](/cli/) | Command-line interface documentation |
| [API Reference](/api/) | Interactive OpenAPI specification |

</div>

## Requirements

- [Bun](https://bun.sh/) 1.2+ or Node.js 18+
- Nomos API token (contact Nomos Energy)

## License

[ISC](https://github.com/tn819/nomos-cli/blob/main/LICENSE)
