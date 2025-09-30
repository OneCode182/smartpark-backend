# SmartPark Backend API

Backend REST API for managing parking events. Implemented with Node.js, Express and MongoDB. The service provides endpoints to load data from a CSV file and to retrieve parking events.

## Technologies

- Node.js
- Express
- MongoDB (Mongoose)
- csv-parser

## Features

- Retrieve all parking events.
- Retrieve a single parking event by `event_id`.
- Bulk load events from CSV (`/data/events.csv`) into the database.
- Clean project structure with routes and models separation.
- Error handling with appropriate HTTP status codes.

## Project structure

```
project-root/
├── models/
│   └── ParkingEvent.js     # Mongoose model for parking events
├── routes/
│   └── parking.routes.js   # API routes: GET all, GET by id, POST load CSV
├── data/
│   └── events.csv          # Example dataset (CSV)
├── server.js               # Application entry point
├── package.json
├── .env                    # Environment variables (not committed)
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/smartpark
PORT=3000
```

4. Start the application in development:
```bash
npm run dev
```
Or in production:
```bash
npm start
```

> If `npm run dev` is not defined, install `nodemon` and run:
```bash
npm install --save-dev nodemon
npx nodemon server.js
```

## API Endpoints

Implemented endpoints:

- `GET /api/events`  
  Retrieve all parking events. Returns a JSON array ordered by `event_id`.

- `GET /api/events/:id`  
  Retrieve a single event by `event_id`. Returns 404 if not found.

- `POST /api/events/load`  
  Load events from `data/events.csv` and insert them into the database. Returns a summary with the inserted count.

Planned or optional endpoints (not necessarily implemented in current code):
- `POST /api/events` — Create a single parking event
- `PUT /api/events/:id` — Update an event by `event_id`
- `DELETE /api/events/:id` — Delete an event by `event_id`

## Example usage

Get all events:
```bash
curl http://localhost:3000/api/events
```

Get event by id:
```bash
curl http://localhost:3000/api/events/1
```

Load CSV into database:
```bash
curl -X POST http://localhost:3000/api/events/load
```

## Error handling

- `500 Internal Server Error` for unexpected failures.
- `404 Not Found` when a requested `event_id` cannot be found.

## Testing

Use tools such as Postman, HTTPie or cURL to test endpoints. For local development, ensure MongoDB is running and `MONGODB_URI` is set correctly.

## License

MIT License.
