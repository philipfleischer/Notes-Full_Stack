import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use('/api/notes', notesRoutes);

app.listen(PORT, () => {
  console.log('Server started on PORT:', PORT);
});
