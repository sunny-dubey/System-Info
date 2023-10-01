# CPU-RAM-USAGE

API service to stream CPU and Memory (RAM) usage in real-time using WebSocket

## Features

### Project status

- [x] Create a Boiler App
- [x] Add all Routes
- [x] Create Controllers Functions
- [x] Local Storage of Active Streams (partially done, can utilize an in-memory database or db like mongoDB)
- [x] Create a Utils Function to Fetch System Info (used os library, facing issue with native wmic commands)
- [x] Create a Utils Function to Start and Stop Streaming Data through WebSocket

## Installation

To run this project onto your local server

- install npm modules onto root directry

```bash
  npm install
```

- To run in development mode

```bash
  npm run dev
```

- To run in build mode

```bash
  npm run build && npm run start
```
