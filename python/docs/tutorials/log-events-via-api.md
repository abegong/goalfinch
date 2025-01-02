# Log Events via API

Learn how to log events to Goal Finch using our REST API.

## API Basics

The Goal Finch API accepts events through a simple REST endpoint.

## Authentication

```bash
# Example authentication header
Authorization: Bearer your-api-key
```

## Logging Events

### HTTP Request

```bash
POST /api/v1/events
Content-Type: application/json

{
  "event_name": "user_action",
  "timestamp": "2025-01-02T13:55:12-07:00",
  "properties": {
    "user_id": "123",
    "action": "button_click"
  }
}
```

## Best Practices

- Batch events when possible
- Handle rate limits
- Implement retry logic
- Monitor API usage

## Error Handling

Common error codes and their solutions...
