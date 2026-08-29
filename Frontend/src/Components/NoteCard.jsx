import { useEffect, useState } from "react";
import "./NoteCard.css";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const wordCount = note.description.trim().split(/\s+/).length;
  const showSeeMore = isSmallScreen ? wordCount > 35 : wordCount > 150;

  useEffect(() => {
    const updateScreenSize = () => setIsSmallScreen(window.innerWidth <= 768);

    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return (
    <article className="note-card">
      <div className="note-card-top">
        <span className="note-card-label">NOTE</span>
        <span className="note-card-dot"></span>
      </div>
      <h2>{note.title}</h2>
      <p className={!isExpanded && showSeeMore ? "note-description-clamped" : ""}>
        {note.description}
      </p>
      {showSeeMore && (
        <button type="button" className="see-more-button" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
      <div className="note-card-actions">
        <button type="button" className="update-note-button" onClick={() => onEdit(note)}>Update</button>
        <button type="button" className="delete-note-button" onClick={() => onDelete(note)}>Delete</button>
      </div>
    </article>
  );
};

export default NoteCard;
