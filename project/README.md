# Social App

The site uses the MERN stack (MongoDB, Express, React, Node.js) to create a social media app.

## Table of contents

- [Usage](#usage)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Automatic installation](#automatic-installation)
    - [Manual installation](#manual-installation)
      - [Frontend](#frontend)
      - [Backend](#backend)
  - [Troubleshooting](#troubleshooting)
- [Configuration](#configuration)
  - [.env File](#env-file)
  - [Token Generation](#token-generation)

## Usage

### Prerequisites

Before you begin setting up and running the Social App, ensure that your development environment meets the following prerequisites:

1. **Node.js**: The Social App is built on Node.js. You'll need to have Node.js installed on your system. You can download Node.js from the official website: [Node.js Downloads](https://nodejs.org/en/download/).
1. **MongoDB**: The Social App relies on MongoDB, a NoSQL database, for data storage. You'll need to have MongoDB installed and running on your system. If you don't have MongoDB installed, you can download the community edition from the official MongoDB website: [MongoDB Downloads](https://www.mongodb.com/try/download/community)

### Installation

When running the app it is assumed that you have a local instance of MongoDB running on port 27017.

### Automatic installation

To quickly set up and start the app, run the following command in your terminal:

```bash
npm run install-and-start
```

This command will generate the .env file, install the required dependencies and start the servers.

To only generate the .env file run the following command:

```bash
npm run generate-env
```

To only install the required dependencies run the following command:

```bash
npm run install-app
```

To only start the servers run the following command:

```bash
npm run start
```

### Manual installation

#### Frontend

To use the app both the frontend and backend servers must be running.
You also must run a local instance of MongoDB.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the frontend server:

```bash
npm start
```

This will launch the frontend of the application in your default web browser.
By default the frontend will run on port 3000. (http://localhost:3000/)

#### Backend

Navigate to the backend directory:

```bash
cd backend
```

> Before going any further follow the instructions in the [Configuration](#configuration) section.

Install the required dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

This will launch the backend of the application on port 5000. (http://localhost:5000/)

## Configuration

### .env File

Create a `.env` file to backend directory with the following variables and replace the values with your own:

```bash
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
```

To generate the tokens follow the instructions in the [Token Generation](#token-generation) section.

## Token Generation

To generate the tokens you can run the following commands in the terminal.

```bash
node
require('crypto').randomBytes(64).toString('hex')
require('crypto').randomBytes(64).toString('hex')
```

Copy the output of the first command to the `ACCESS_TOKEN_SECRET` variable and the output of the second command to the `REFRESH_TOKEN_SECRET` variable.

## Testing

Testing is only available for the backend.

> Before running the tests follow the instructions in the [Configuration](#configuration) section.
> Also make sure that you have a local instance of MongoDB running on port 27017.

To run the tests navigate to the backend directory and run the following command:

```bash
npm test
```

You can also generate a coverage report by running the following command:

```bash
npm run coverage
```

This will generate a coverage report in the `backend/coverage` directory. Open the index.html file in your browser to view the report.
