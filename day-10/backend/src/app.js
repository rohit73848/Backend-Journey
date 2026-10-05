const express = require("express");
const app = express();
const noteModel = require("./models/note.model");
const cors = require("cors");
const path = require("path");



app.use(cors());
app.use(express.json());
app.use(express.static("./public"));
/*
 * POST /api/notes
 * create a new note and save it to the database
 * req.body {title,description}
 */
app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;

  const note = await noteModel.create({ title, description });
  res.status(201).json({ message: "Note created successfully", note });
});
 
/*
 * GET /api/notes
 * get all notes from the database
 */
app.get("/api/notes", async (req, res) => {
  const notes = await noteModel.find();
  res.status(200).json({ message: "Notes fetched successfully", notes });
});

/*
* DELETE /api/notes/:id
* delete a note by id from the database
*/
app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  await noteModel.findByIdAndDelete(id);
  res.status(200).json({ message: "Note deleted successfully" });
});


/*
* PATCH /api/notes/:id
* update a note by id from the database
*/
app.patch("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const note = await noteModel.findByIdAndUpdate(id, { title, description }, { new: true });
  res.status(200).json({ message: "Note updated successfully", note });
});
console.log(__dirname);
app.use('*name',(req,res)=>{
  // res.send('404 Not Found, This in wild card');
  res.sendFile(path.join(__dirname ,"..", "/public/index.html"));
})
module.exports = app;
