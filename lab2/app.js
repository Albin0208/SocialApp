import express from 'express';
import router from './router.js';

const app = express();
const port = 5000;

app.use(express.json()) 

// Use the router middleware
app.use(router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});