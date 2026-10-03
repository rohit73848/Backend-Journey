import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Form State for creating a new note
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State (for PATCH API)
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Show temporary toast message
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch all notes (GET)
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setNotes(res.data.notes || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      showToast("Failed to load notes. Please check the server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create Note (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast("Please enter both title and description.", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(API_BASE, {
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      showToast(res.data.message || "Note created successfully!");
      fetchNotes();
    } catch (err) {
      console.error("Error creating note:", err);
      showToast(
        err.response?.data?.message || "Failed to create note. Try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start Editing
  const startEditing = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditDescription(note.description);
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  // Update Note (PATCH)
  const handleUpdateNote = async (noteId) => {
    if (!editTitle.trim() || !editDescription.trim()) {
      showToast("Title and description cannot be empty.", "warning");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await axios.patch(`${API_BASE}/${noteId}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });

      // Update the note in local state immediately
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? res.data.note : note
        )
      );

      cancelEditing();
      showToast(res.data.message || "Note updated successfully!");
    } catch (err) {
      console.error("Error updating note:", err);
      showToast(
        err.response?.data?.message || "Failed to update note. Try again.",
        "error"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Note (DELETE)
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const res = await axios.delete(`${API_BASE}/${noteId}`);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      showToast(res.data.message || "Note deleted successfully!");
    } catch (err) {
      console.error("Error deleting note:", err);
      showToast(
        err.response?.data?.message || "Failed to delete note. Try again.",
        "error"
      );
    }
  };

  // Filter notes by search query
  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.toLowerCase();
    return (
      (note.title && note.title.toLowerCase().includes(q)) ||
      (note.description && note.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" && "✓"}
            {toast.type === "error" && "✕"}
            {toast.type === "warning" && "!"}
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <h1>Modern Notes</h1>
            <p className="subtitle">Capture & organize your thoughts effortlessly</p>
          </div>
        </div>

        <div className="header-badge">
          <span>{notes.length}</span> {notes.length === 1 ? "Note" : "Notes"}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Note Creator Form */}
        <section className="card form-card">
          <h2 className="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create New Note
          </h2>

          <form onSubmit={handleSubmit} className="note-create-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Node.js & MongoDB"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your note details here..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Creating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Note
                </>
              )}
            </button>
          </form>
        </section>

        {/* Notes Feed Section */}
        <section className="notes-section">
          {/* Controls: Search Bar */}
          <div className="feed-controls">
            <div className="search-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search notes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {searchQuery && (
              <span className="search-result-count">
                Found {filteredNotes.length} matching {filteredNotes.length === 1 ? "note" : "notes"}
              </span>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner large"></div>
              <p>Fetching your notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            /* Empty State */
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <h3>{searchQuery ? "No matching notes found" : "No notes yet"}</h3>
              <p>
                {searchQuery
                  ? "Try checking your keywords or clear the search filter."
                  : "Start creating your notes using the form above!"}
              </p>
            </div>
          ) : (
            /* Notes Grid */
            <div className="notes-grid">
              {filteredNotes.map((note) => {
                const isEditing = editingId === note._id;

                return (
                  <article key={note._id} className={`note-card ${isEditing ? "editing" : ""}`}>
                    {isEditing ? (
                      /* Inline Edit Mode (PATCH API) */
                      <div className="edit-mode-form">
                        <div className="edit-badge">Editing Note</div>
                        <div className="form-group">
                          <label>Title</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Note title"
                            className="edit-input"
                            autoFocus
                          />
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            rows="4"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Note description"
                            className="edit-textarea"
                          ></textarea>
                        </div>
                        <div className="edit-actions">
                          <button
                            type="button"
                            className="btn btn-save"
                            onClick={() => handleUpdateNote(note._id)}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={cancelEditing}
                            disabled={isUpdating}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal Display Mode */
                      <>
                        <div className="note-card-body">
                          <h3 className="note-title">{note.title}</h3>
                          <p className="note-description">{note.description}</p>
                        </div>

                        <div className="note-card-footer">
                          <button
                            type="button"
                            className="btn-action edit-btn"
                            title="Edit Note (PATCH)"
                            onClick={() => startEditing(note)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="btn-action delete-btn"
                            title="Delete Note"
                            onClick={() => handleDeleteNote(note._id)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
