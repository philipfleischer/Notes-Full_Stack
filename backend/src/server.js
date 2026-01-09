import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);
app.use(express.json()); //This middleware will parse JSON bodies: req.body
app.use(rateLimiter);

app.use('/api/notes', notesRoutes);

// Start the database successfully, then start the app
// --> Useless to start the app without the ability to see stored notes or create and save new ones.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server started on PORT:', PORT);
  });
});
