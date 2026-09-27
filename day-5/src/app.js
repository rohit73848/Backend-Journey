const express = require("express");
const app = express();

app.use(express.json())

const notes = []

// POST /notes
app.post("/notes",(req,res)=>{
    console.log(req.body)
      const note = req.body
    notes.push(note)
  res.status(201).json({
    message:"Note Created Successfully"
  }) 
})

// GET /notes
app.get("/notes",(req,res)=>{
    res.status(200).json({
        notes:notes
    })
})
// DELETE /notes/:index
app.delete("/notes/:index",(req,res)=>{
    delete notes[req.params.index]
    res.status(204).json({
        message:"Note Deleted Successfully"
    })
})

// PATCH /notes/:index
// req.body = {description :- "sample modified description."}

app.patch("/notes/:index",(req,res)=>{
    notes[req.params.index].description = req.body.description
    res.status(200).json({
        message:"Note Updated Successfully"
    })
})



module.exports = app;