# Authentication

Learn how to authenticate with the Goal Finch API.

## API Keys

Goal Finch uses API keys for authentication. Each key has specific permissions and can be restricted to certain endpoints.

## Getting Started

1. Generate an API key in your dashboard
2. Add the key to your request headers
3. Test the authentication

## Example Usage

```bash
curl -X GET https://api.goalfinch.com/v1/data \
  -H "Authorization: Bearer your-api-key"
```

## Security Best Practices

- Rotate keys regularly
- Use environment variables
- Never commit API keys
- Set appropriate permissions

## Key Management

How to create, rotate, and revoke API keys...
