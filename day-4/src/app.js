const express = require("express");
const app = express();
app.get("/",(req,res)=>{
    res.send("Home Page")
})
app.use(express.json())
const notes = []
 
// POST /notes
app.post("/notes",(req,res)=>{
    console.log(req.body)
      const note = req.body
    notes.push(note)
    res.send("note create hoye geche")
})

// GET /notes
app.get("/notes",(req,res)=>{
    res.send(notes)
console.log(notes)
})

// DELETE /notes
// params
// delete /notes/2
app.delete("/notes/:index",(req,res)=>{
    delete notes[req.params.index]
    res.send("note deleted")
}) 

// PATCH /notes/:index
// req.body = {description :- "sample modified description."}

app.patch("/notes/:index",(req,res)=>{
    notes[req.params.index].description = req.body.description
    res.send("Note Updated")
})

module.exports = app;
