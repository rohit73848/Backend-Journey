const express = require("express");
const app = express();
const noteModel = require("./models/note.model");
app.use(express.json());
// POST /api/notes
// create new note and save data nin mongodb
// req.body = {title,description}

app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;
  const note = await noteModel.create({
    title,
    description,
  });
  res.status(201).json({
    message: "Note Created Successfully",
    note,
  });
});

// GET /api/notes
// Fetch all the data from mongodb and send them in the response

app.get("/api/notes", async (req, res) => {
  const notes = await noteModel.find();

  res.status(200).json({
    message: "Notes Fetched Successfully",
    notes,
  });
});

// DELETE /api/notes/:id
// delete note with the id from req.params

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  await noteModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "Note Deleted Successfully",
  });
});

// PATCH /api/notes/:id
// update the description of the note by id
// req.body = {description}

app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;
  const note = await noteModel.findByIdAndUpdate(id, { description });
  res.status(200).json({
    message: "Note Updated Successfully",
    note,
  });
});
module.exports = app;
