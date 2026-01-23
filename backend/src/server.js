import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== 'production') {
  //Middleware
  app.use(
    cors({
      origin: 'http://localhost:5173',
    }),
  );
}
app.use(express.json()); //This middleware will parse JSON bodies: req.body
app.use(rateLimiter);

app.use('/api/notes', notesRoutes);

// 1. Start in the __dirname directory this file is located in.
// 2. Go to parent directory ( .. )
// 3. cd frontend/dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));

//Only implement this if we are in a production environment
if (process.env.NODE_ENV === 'production') {
  // If we get a path any other than the one above (the Correct one)
  // We only want to do this if we are on render.com
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Start the database successfully, then start the app
// --> Useless to start the app without the ability to see stored notes or create and save new ones.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server started on PORT:', PORT);
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});
