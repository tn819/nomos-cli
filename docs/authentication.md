# Authentication

The Nomos API supports two authentication methods:

## Bearer Token

Most straightforward for server-to-server API calls.

### CLI

```bash
nomos login --token "your-bearer-token"
```

Credentials are stored in `~/.nomos/config.json` with restricted permissions (0600).

### SDK

```typescript
import { NomosSDK } from "nomos-sdk-cli";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
});
```

## OAuth Client Credentials

For OAuth 2.0 client credentials flow.

### CLI

```bash
nomos login \
  --client-id "your-client-id" \
  --client-secret "your-client-secret"
```

### SDK

```typescript
const sdk = new NomosSDK({
  basicAuth: {
    username: "your-client-id",
    password: "your-client-secret",
  },
});
```

The SDK will automatically exchange credentials for a bearer token on the first API call.

## Getting Credentials

Contact Nomos Energy to obtain:
- Bearer tokens for testing
- OAuth client credentials for production

## Environment Variables

You can also pass tokens directly without storing them:

```bash
export NOMOS_TOKEN="your-token"
nomos call get-plans --token "$NOMOS_TOKEN"
```

## Security Best Practices

- Never commit tokens to version control
- Use environment variables in production
- Rotate credentials regularly
- The CLI stores credentials with 0600 permissions
