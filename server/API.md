# Niblings App API Documentation

## Events API

### Add Event
`POST /api/events`

Creates a new event in the system.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| event_type | string | Yes | A slug identifying the type of event (e.g., "family_dinner", "doctor_visit") |
| title | string | No | A human-readable title for the event |
| start_ts | string | No | ISO 8601 timestamp for when the event starts. Required for events that happen at a specific time |
| end_ts | string | Yes | ISO 8601 timestamp for when the event ends |
| payload | object | No | Additional event-specific data in JSON format |

#### Example Request
```json
{
  "event_type": "family_dinner",
  "title": "Monthly Family Dinner",
  "start_ts": "2024-12-31T18:00:00-07:00",
  "end_ts": "2024-12-31T21:00:00-07:00",
  "payload": {
    "location": "Grandma's House",
    "attendees": ["Mom", "Dad", "Kids"],
    "food_preferences": "Vegetarian options needed"
  }
}
```

#### Response
Returns a 201 Created status with the created event object.

#### Response Body

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique UUID for the event (server-generated) |
| event_type | string | The type of event |
| title | string\|null | Event title if provided |
| start_ts | string\|null | Start timestamp if provided |
| end_ts | string | End timestamp |
| created_at_ts | string | Server timestamp when the event was created |
| payload | object | Additional event data |

#### Example Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "event_type": "family_dinner",
  "title": "Monthly Family Dinner",
  "start_ts": "2024-12-31T18:00:00-07:00",
  "end_ts": "2024-12-31T21:00:00-07:00",
  "created_at_ts": "2024-12-29T19:46:02-07:00",
  "payload": {
    "location": "Grandma's House",
    "attendees": ["Mom", "Dad", "Kids"],
    "food_preferences": "Vegetarian options needed"
  }
}
```

#### Error Responses

- `400 Bad Request`: When required fields are missing or invalid
  ```json
  {
    "error": "event_type and end_ts are required fields"
  }
  ```
  
- `400 Bad Request`: When timestamp format is invalid
  ```json
  {
    "error": "Invalid end_ts format"
  }
  ```

### List Events
`GET /api/events`

Retrieves all events stored in the system.

#### Response
Returns a 200 OK status with an array of event objects.

#### Example Response
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "event_type": "family_dinner",
    "title": "Monthly Family Dinner",
    "start_ts": "2024-12-31T18:00:00-07:00",
    "end_ts": "2024-12-31T21:00:00-07:00",
    "created_at_ts": "2024-12-29T19:46:02-07:00",
    "payload": {
      "location": "Grandma's House",
      "attendees": ["Mom", "Dad", "Kids"],
      "food_preferences": "Vegetarian options needed"
    }
  }
]
```

### Get Events by Type
`GET /api/events/:eventType`

Retrieves events of a specific type, with options for time filtering and output format.

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| eventType | string | Yes | The type of event to filter by |

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | number | No | The year to filter events by (must be used with month) |
| month | number | No | The month to filter events by (1-12, must be used with year) |
| csv | boolean | No | If set to 'true', returns data in CSV format |

#### Response Format
By default, returns JSON. If `csv=true` is specified, returns a CSV file with flattened event data.

#### Default Behavior
- If year and month are not provided, returns events from the last month to present
- If year and month are provided, returns all events for that specific month
- JSON response includes full event objects with nested payload
- CSV response flattens payload fields into separate columns with 'payload_' prefix

#### Example Requests
1. Get events from last month (default):
```
GET /api/events/family_dinner
```

2. Get events for a specific month:
```
GET /api/events/family_dinner?year=2024&month=12
```

3. Get events as CSV:
```
GET /api/events/family_dinner?csv=true
```

#### Response
Returns a 200 OK status with either:
- An array of event objects (JSON format)
- A CSV file (when csv=true) with filename `{eventType}-events.csv`

#### Error Responses
- `500 Internal Server Error`: When database query fails
  ```json
  {
    "error": "Failed to retrieve events"
  }
  ```

## Notes
- All timestamps should be in ISO 8601 format with timezone information
- The `payload` object can contain any valid JSON data specific to the event type
- Events are currently stored in memory and will be cleared when the server restarts
