import React, { useState, useEffect } from "react";
import { getNotes, addNote, updateNote, deleteNote } from "../api/api";
import ReactMarkdown from "react-markdown";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  const fetchNotes = async () => {
    try {
      const data = await getNotes(token);
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes", error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) {
      alert("Please enter a title and content.");
      return;
    }

    try {
      await addNote(newNote, token);
      setNewNote({ title: "", content: "" });
      fetchNotes();
    } catch (error) {
      console.error("Error adding note", error);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote.title || !editingNote.content) {
      alert("Title and content are required.");
      return;
    }

    try {
      await updateNote(editingNote.id, editingNote, token);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error("Error updating note", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId, token);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  return (
    <div className="page-enter glass p-5 text-white">
      <h1 className="text-3xl font-bold">Notes</h1>

      {/* Add Note Form */}
      <div className="mt-5 p-5 bg-gray-800 rounded shadow-md">
        <h2 className="text-xl font-bold">Add Note</h2>
        <form onSubmit={handleAddNote} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <textarea
            placeholder="Content (supports Markdown)"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            rows="4"
            required
          ></textarea>
          <button type="submit" className="w-full p-2 bg-green-500 rounded">
            Add Note
          </button>
        </form>
      </div>

      {/* Notes List */}
      {notes.map((note) => (
        <div key={note.id} className="mt-5 p-5 bg-gray-800 rounded shadow-md">
          <h2 className="text-xl font-bold">{note.title}</h2>
          <ReactMarkdown className="mt-2">{note.content}</ReactMarkdown>
          <button className="bg-blue-500 px-3 py-1 rounded mr-2" onClick={() => setEditingNote(note)}>
            Edit
          </button>
          <button className="bg-red-500 px-3 py-1 rounded" onClick={() => handleDeleteNote(note.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notes;
