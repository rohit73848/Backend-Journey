const express = require("express");
const app = express();
const noteModel = require("./models/note.model");
const cors = require("cors");
const path = require("path");

// Serve static assets from public folder with reliable absolute path
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cors());
app.use(express.json());

// POST /api/notes
// create new note and save data in mongodb
// req.body = {title, description}
app.post("/api/notes", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const note = await noteModel.create({
      title,
      description,
    });

    res.status(201).json({
      message: "Note Created Successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
});

// GET /api/notes
// Fetch all the data from mongodb and send them in the response
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await noteModel.find().sort({ _id: -1 });

    res.status(200).json({
      message: "Notes Fetched Successfully",
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching notes",
      error: error.message,
    });
  }
});

// DELETE /api/notes/:id
// delete note with the id from req.params
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNote = await noteModel.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting note",
      error: error.message,
    });
  }
});

// PATCH /api/notes/:id
// update the title and/or description of the note by id
// req.body = {title, description}
app.patch("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;

    // { new: true } ensures the updated document is returned, not the old one
    const note = await noteModel.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note Updated Successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating note",
      error: error.message,
    });
  }
});

// Catch-all fallback for Single Page Application (SPA)
// Any route not caught by the API endpoints above serves index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
