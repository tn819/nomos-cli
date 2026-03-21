# Installation

## Prerequisites

- [Bun](https://bun.sh/) 1.2+ (for development)
- Node.js 18+ (for built CLI)
- Nomos API token

## Global Install

Install the CLI globally via npm:

```bash
npm install -g nomos-sdk-cli
```

Then login and explore:

```bash
nomos login --token "$NOMOS_TOKEN"
nomos capabilities
```

## Development Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/tn819/nomos-cli.git
cd nomos-cli
bun install
```

Build the CLI:

```bash
bun run build
```

Run in development mode:

```bash
bun run dev -- help
```

## SDK Installation

Install as a dependency in your project:

```bash
npm install nomos-sdk-cli
```

Or with Bun:

```bash
bun add nomos-sdk-cli
```

## Next Steps

- [Authentication](/guide/authentication) — Set up your API credentials
- [Checkout](/guide/checkout) — Learn the checkout flow
- [CLI Reference](/cli/) — Explore CLI commands
- [SDK Reference](/sdk/) — Browse SDK documentation
