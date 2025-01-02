# Development Setup

Guide for setting up your local development environment for Goal Finch.

## Prerequisites

- Python 3.8+
- Node.js 18+
- Docker
- Git

## Local Setup

1. Clone the repository
```bash
git clone https://github.com/goalfinch/goalfinch.git
cd goalfinch
```

2. Install dependencies
```bash
python -m pip install -r requirements.txt
npm install
```

3. Set up environment
```bash
cp .env.example .env
# Edit .env with your local settings
```

## Development Server

Start the development server:
```bash
npm run dev
```

## Running Tests

```bash
python -m pytest
npm test
```

## Development Tools

- Pre-commit hooks
- Code formatting
- Linting setup
