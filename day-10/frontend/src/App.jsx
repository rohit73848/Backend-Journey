import { useState, useEffect } from "react";

import axios from "axios";

function App() {
  // ! Store all notes in React state
  const [notes, setNotes] = useState([]);

  const [editingNote, setEditingNote] = useState(null);

  // Fetch notes from the backend
  function fetchNotes() {
    axios.get("/api/notes").then((res) => {
      setNotes(res.data.notes);
    });
  }

  // ! Fetch notes when the component first renders
  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle form submission and create a new note
  function handleSubmit(e) {
    e.preventDefault();

    // Get input values from the form
    const { title, description } = e.target.elements;

    // Send a POST request to create a note
    axios
      .post("/api/notes", {
        title: title.value,
        description: description.value,
      })
      .then((res) => {
        console.log(res.data);

        // Refresh the notes list and clear the form
        fetchNotes();
        e.target.reset();
      });
  }

  function handleDelete(noteId) {
    axios.delete(`/api/notes/${noteId}`).then((res) => {
      console.log(res.data);
      fetchNotes();
    });
  }

  function handleEditNote(note) {
    setEditingNote(note);
  }

  function handleUpdateNote(e) {
    e.preventDefault();

    const { title, description } = e.target.elements;

    axios
      .patch(`/api/notes/${editingNote._id}`, {
        title: title.value,
        description: description.value,
      })
      .then((res) => {
        console.log(res.data);
        setEditingNote(null);
        fetchNotes();
      });
  }

  return (
    <>
      <div className="main">
        {/* Form for creating a new note */}
        <form className="note-create-form" onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Enter title" />

          <input
            type="text"
            name="description"
            placeholder="Enter description"
          />

          <button>Create Note</button>
        </form>

        {/* Form for editing an existing note */}
        {editingNote && (
          <form onSubmit={handleUpdateNote}>
            <input
              type="text"
              name="title"
              defaultValue={editingNote.title}
            />

            <input
              type="text"
              name="description"
              defaultValue={editingNote.description}
            />

            <button type="submit">Update Note</button>
          </form>
        )}

        {/* Display all notes fetched from the backend */}
        <div className="notes">
          {notes.map((note, index) => {
            return (
              <div className="note" key={index}>
                <h1>{note.title}</h1>

                <p>{note.description}</p>

                <button
                  onClick={() => {
                    handleDelete(note._id);
                  }}
                >
                  Delete Note
                </button>

                <button onClick={() => handleEditNote(note)}>
                  Edit Note
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;