import mongoose from 'mongoose';

// 1 - Create a Schema
// 2 - Create a Model based off of the schema

// ------ SCHEMA ------
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }, //createdAt, updatedAt
);

// ------ Model ------
const Note = mongoose.model('Note', noteSchema);

export default Note;
