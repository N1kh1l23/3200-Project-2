# 3200-Project-2

# SlangDB — MongoDB Document Database
**CS 3200 — Database Design | Project 2**

A document database for Gen-Z slang semantics, adapted from the relational model in Project 1. SlangDB catalogs slang terms with definitions, usage examples, cultural origins, categories, regional usage data, and semantic relationships between terms.

## Project Structure

```
3200-Project-2/
├── docs/
│   ├── SlangDB - Business Requirements Document.pdf
│   ├── UML.png
│   └── Logical Model.png
├── data/
│   ├── terms.json          (25 slang terms)
│   └── users.json           (8 users)
├── queries/
│   ├── Query1.js            (Aggregation: avg popularity by category)
│   ├── Query2.js            (Complex search: $or with $and)
│   ├── Query3.js            (Count documents for a specific user)
│   ├── Query4.js            (Update: toggle isActive boolean)
│   └── Query5.js            (Synonym relationship lookup)
├── app/
│   ├── server.js            (Express CRUD application)
│   ├── views/               (EJS templates)
│   └── public/              (Static assets)
├── README.md
├── AI_DISCLOSURE.md
└── package.json
```

## Setup

### Prerequisites
- Node.js
- MongoDB (running locally on port 27017, or via Docker)

### Install Dependencies
```bash
npm install
```

### Database Initialization

**Option 1: Docker (recommended)**
```bash
docker start mongodb
docker cp data/terms.json mongodb:/terms.json
docker cp data/users.json mongodb:/users.json
docker exec mongodb mongoimport -d slangDB -c terms --file /terms.json --jsonArray
docker exec mongodb mongoimport -d slangDB -c users --file /users.json --jsonArray
```

**Option 2: Local MongoDB**
```bash
mongoimport -h localhost:27017 -d slangDB -c terms --file data/terms.json --jsonArray
mongoimport -h localhost:27017 -d slangDB -c users --file data/users.json --jsonArray
```

## Running the Queries

```bash
node queries/Query1.js   # Aggregation: average popularity score per category
node queries/Query2.js   # Complex search: active terms that are Peak OR popularity > 8
node queries/Query3.js   # Count: how many terms gen_z_translator contributed
node queries/Query4.js   # Update: deactivate "bussin" (set isActive to false)
node queries/Query5.js   # Synonym relationships between terms
```

## Query Descriptions

### Query 1 — Aggregation Pipeline
Uses `$unwind`, `$group`, and `$sort` to calculate the average popularity score for each category across all terms, sorted from highest to lowest.

### Query 2 — Complex Search with $or
Finds all active terms where the trending status is "Peak" OR the popularity score is greater than 8.0. Demonstrates combining implicit `$and` with `$or`.

### Query 3 — Count Documents for a Specific User
Retrieves user `gen_z_translator` and counts how many terms they have contributed using the `contributedTermIds` array length.

### Query 4 — Update Document
Toggles the `isActive` field to `false` for the term "bussin" to demonstrate updating a document based on a query parameter.

### Query 5 — Synonym Relationship Lookup
Uses `$unwind`, `$match`, and `$project` to extract and display all synonym relationships between terms, showing each term alongside its synonym and confidence score.

## Running the Express App

```bash
node app/server.js
```
Then open http://localhost:3000 in your browser.

## Collections

### terms (25 documents)
Root collection containing slang terms with embedded definitions, examples, origin, categories, regions, and semantic relations.

### users (8 documents)
Secondary collection containing user profiles with embedded contributed and favorite term IDs.

## Technologies
- Node.js
- MongoDB (native driver)
- Express.js
- EJS (templating)
