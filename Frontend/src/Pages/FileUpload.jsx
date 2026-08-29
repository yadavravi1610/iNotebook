import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./FileUpload.css";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    const next = Array.from(fileList || []);
    if (!next.length) return;

    setFiles((prev) => {
      const merged = [...prev, ...next];
      const unique = [];

      for (const file of merged) {
        if (unique.length >= 3) break;
        if (!unique.some((item) => item.name === file.name && item.size === file.size)) {
          unique.push(file);
        }
      }

      return unique;
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      toast.error("Please select at least one file.");
      return;
    }

    const formdata = new FormData();
    files.forEach((file) => formdata.append("my-file", file));

    try {
      setUploading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload/file-upload`,
        {
          method: "POST",
          body: formdata,
        },
      );

      const json = await response.json();

      if (json.success === false) {
        toast.error(json.message || "Upload failed.");
        return;
      }

      toast.success(json.message || "Files uploaded successfully.");
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      toast.error("Unable to reach the server. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <main className="upload-page">
        <section className="upload-card" aria-labelledby="upload-title">
          <header className="upload-header">
            <p className="upload-kicker">ATTACHMENTS</p>
            <h1 id="upload-title">Upload your files</h1>
            <p className="upload-subtitle">
              Drop up to 3 files here, or browse from your device.
            </p>
          </header>

          <form className="upload-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              id="my-file"
              name="my-file"
              type="file"
              multiple
              className="upload-input"
              onChange={(e) => addFiles(e.target.files)}
            />

            <label
              htmlFor="my-file"
              className={`dropzone ${dragging ? "is-dragging" : ""}`}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
            >
              <span className="dropzone-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 16V6" />
                  <path d="M8.5 9.5 12 6l3.5 3.5" />
                  <path d="M5 18h14" />
                </svg>
              </span>
              <strong>Drag & drop files here</strong>
              <span>PDF, images, docs — max 3 files</span>
              <span className="browse-pill">Browse files</span>
            </label>

            {files.length > 0 && (
              <ul className="file-list" aria-label="Selected files">
                {files.map((file, index) => (
                  <li key={`${file.name}-${file.size}-${index}`}>
                    <div className="file-meta">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatSize(file.size)}</span>
                    </div>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              className="upload-button"
              type="submit"
              disabled={uploading || files.length === 0}
            >
              {uploading ? "Uploading…" : "Upload files"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default FileUpload;
