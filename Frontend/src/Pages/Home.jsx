import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../Components/Navbar";
import NoteCard from "../Components/NoteCard";
import "./Home.css";
import toast, { Toaster } from "react-hot-toast";

const Home = () => {
  const navigation = useNavigate();
  const [notes, setNotes] = useState([]);
  const [noNotesFound, setNoNotesFound] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchMyNotes = async () => {
    if (sessionStorage.getItem("token")) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/fetch-user-notes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
          },
        },
      );

      const json = await response.json();
      setNotes(json.notes);
      if (json.notes.length === 0) {
        setNoNotesFound(true);
      } else {
        setNoNotesFound(false);
      }
      console.log(json);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/notes/create-new-note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      },
    );

    const json = await response.json();

    if (json.success) {
      toast.success(json.message);
      setTitle("");
      setDescription("");
      fetchMyNotes();
      setShowAddNote(false);
    } else {
      toast.error(json.message);
    }
  };

  const openUpdateNote = (note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditDescription(note.description);
  };

  const updateNote = async(event)=>{
    event.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/update-specific-note`,{
        method: "PUT",
        headers:{
          "Content-Type":"application/json",
          "token": sessionStorage.getItem("token")
        },
        body: JSON.stringify({
          _id: editingNote._id,
          title: editTitle,
          description: editDescription
        })
      });

      const json = await response.json();

      if(json.success){
        toast.success(json.message);
        fetchMyNotes();
        setEditingNote(null);
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const deleteNote = async (note) => {
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/delete-specific-note`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({ _id: note._id }),
        },
      );
      const json = await response.json();

      if (json.success) {
        fetchMyNotes();
        // setNotes((currentNotes) =>
        //   currentNotes.filter((currentNote) => currentNote._id !== note._id),
        // );
        // setNoNotesFound(notes.length === 1);
        toast.success(json.message);
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Something went wrong while deleting the note");
    }
  };
  useEffect(() => {
    fetchMyNotes();
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigation("/login");
    }
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <div className="home-screen">
        <Navbar onAddNote={() => setShowAddNote(true)} />
        <main className="home-page">
        {noNotesFound && (
          <div className="no-notes-card">
            <div>
              <div className="no-notes-icon">&#9998;</div>
              <h2>No notes found</h2>
              <p>Create a note to keep your ideas organized.</p>
            </div>
          </div>
        )}

        <section className="notes-grid">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={openUpdateNote}
              onDelete={deleteNote}
            />
          ))}
        </section>
        </main>

        {showAddNote && (
        <div className="add-note-overlay" onClick={() => setShowAddNote(false)}>
          <form
            className="add-note-modal"
            onSubmit={handleSubmit}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="add-note-modal-header">
              <div>
                <p>YOUR INOTEBOOK</p>
                <h1>Add a note</h1>
              </div>
              <button
                type="button"
                className="close-add-note"
                onClick={() => setShowAddNote(false)}
                aria-label="Close add note form"
              >
                &times;
              </button>
            </div>
            <p className="add-note-copy">
              Capture your thought before it gets away.
            </p>

            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give your note a title"
              minLength="3"
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write your note here..."
              minLength="3"
              required
            />

            <div className="add-note-modal-actions">
              <button
                type="button"
                className="cancel-add-note"
                onClick={() => setShowAddNote(false)}
              >
                Cancel
              </button>
              <button type="submit" className="save-add-note">
                Save note
              </button>
            </div>
          </form>
        </div>
        )}

        {editingNote && (
          <div className="add-note-overlay" onClick={() => setEditingNote(null)}>
            <form className="add-note-modal" onSubmit={updateNote} onClick={(event) => event.stopPropagation()}>
              <div className="add-note-modal-header">
                <div>
                  <p>YOUR INOTEBOOK</p>
                  <h1>Update note</h1>
                </div>
                <button type="button" className="close-add-note" onClick={() => setEditingNote(null)} aria-label="Close update note form">&times;</button>
              </div>
              <p className="add-note-copy">Make changes and save your updated note.</p>

              <label htmlFor="edit-title">Title</label>
              <input id="edit-title" type="text" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} minLength="3" required />

              <label htmlFor="edit-description">Description</label>
              <textarea id="edit-description" value={editDescription} onChange={(event) => setEditDescription(event.target.value)} minLength="3" required />

              <div className="add-note-modal-actions">
                <button type="button" className="cancel-add-note" onClick={() => setEditingNote(null)}>Cancel</button>
                <button type="submit" className="save-add-note">Save changes</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
