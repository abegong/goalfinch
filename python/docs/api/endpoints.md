# API Endpoints

Complete reference for all Goal Finch API endpoints.

## Events API

### POST /api/v1/events
Log new events to the system

### GET /api/v1/events
Query historical events

## Data API

### GET /api/v1/data
Retrieve processed data

### POST /api/v1/data/import
Import data from external sources

## Management API

### GET /api/v1/health
System health check

### GET /api/v1/status
Service status and metrics

## Response Formats

All API responses follow this structure:

```json
{
  "status": "success",
  "data": {},
  "meta": {
    "timestamp": "2025-01-02T13:55:12-07:00"
  }
}
```
