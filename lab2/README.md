# Lab-2 Tweeeter API

Simple API for Tweeeter application. The API is built on Specification 1 on the course-site

## Prerequisites

Before you can run the project, ensure that you have the following prerequisites installed on your system:

- **Node.js**: You can download it from [nodejs.org](https://nodejs.org/).

- **MongoDB**: You need a MongoDB server installed and running. You can download and install MongoDB Community Edition from the [MongoDB Download Center](https://www.mongodb.com/try/download/community).

## Installation

To install the required dependencies, follow these steps:

1. Open your terminal.

2. Navigate to the project's root directory.

3. Run the following command to install the necessary libraries:

```bash
npm install
```

## Usage

To use the Tweeeter API, follow these steps:

1. Start the MongoDB server. You can do this by running the following command:

```bash
sudo systemctl start mongod
```

2. Run the project using the following command:

```bash
npm start
```

You can now access the API. Use a tool like Postman to test the API endpoints. The API will be available at http://localhost:5000 by default.

## Tests

You can run the project's tests to ensure its functionality. Follow these steps:

1. Open your terminal.

1. Navigate to the project's root directory.

1. Run the tests using the following command:
```bash
npm test
```

You can also get the test coverage by running the following command:
```bash
npm run coverage
```