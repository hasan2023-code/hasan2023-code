import { useState } from "react";

const initialRows = [
  {
    id: 1,
    name: "John Doe",
    state: "California",
    street: "123 Maple Street",
    pincode: "90001",
    uploadStatus: "idle",
    progress: 0,
    uploadId: null,
  },
  {
    id: 2,
    name: "Jane Smith",
    state: "Texas",
    street: "456 Oak Avenue",
    pincode: "73301",
    uploadStatus: "idle",
    progress: 0,
    uploadId: null,
  },
  {
    id: 3,
    name: "Aman Verma",
    state: "New York",
    street: "789 Pine Road",
    pincode: "10001",
    uploadStatus: "idle",
    progress: 0,
    uploadId: null,
  },
];

function FileSuccessIcon() {
  return (
    <span className="file-success-icon" aria-label="File uploaded successfully" title="Uploaded">
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
      </svg>
      <span className="check-badge" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M4 8.5 7 11.5 12 5.5" />
        </svg>
      </span>
    </span>
  );
}

function App() {
  const [rows, setRows] = useState(initialRows);
  const [infoMessage, setInfoMessage] = useState("");

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files || []);

    const pdfFiles = selected.filter(
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length === 0) {
      setInfoMessage("Please select PDF files only.");
      event.target.value = "";
      return;
    }

    const availableRows = rows.filter((row) => row.uploadStatus !== "uploading");
    const assignableFiles = pdfFiles.slice(0, availableRows.length);

    if (assignableFiles.length === 0) {
      setInfoMessage("All rows are uploading. Please wait for uploads to complete.");
      event.target.value = "";
      return;
    }

    if (assignableFiles.length < pdfFiles.length) {
      setInfoMessage(
        `Selected ${pdfFiles.length} files. Started upload for ${assignableFiles.length} file(s).`
      );
    } else {
      setInfoMessage("");
    }

    const uploadTasks = assignableFiles.map((_, index) => ({
      rowId: availableRows[index].id,
      uploadId: crypto.randomUUID(),
    }));

    setRows((prev) =>
      prev.map((row) => {
        const task = uploadTasks.find((item) => item.rowId === row.id);
        if (!task) {
          return row;
        }

        return {
          ...row,
          uploadStatus: "uploading",
          progress: 0,
          uploadId: task.uploadId,
        };
      })
    );

    uploadTasks.forEach((task) => {
      uploadFileToApi(task);
    });

    event.target.value = "";
  };

  const uploadFileToApi = ({ rowId, uploadId }) => {
    let current = 0;

    const timer = setInterval(() => {
      const increment = Math.floor(Math.random() * 16) + 5;
      const next = Math.min(current + increment, 95);
      current = next;

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId && row.uploadId === uploadId ? { ...row, progress: next } : row
        )
      );
    }, 400);

    // Simulated API call to store file in local/remote storage.
    setTimeout(() => {
      clearInterval(timer);

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId && row.uploadId === uploadId
            ? {
                ...row,
                progress: 100,
                uploadStatus: "stored",
              }
            : row
        )
      );
    }, 3000 + Math.floor(Math.random() * 3000));
  };

  return (
    <div className="container">
      <h1>Address & PDF Upload Dashboard</h1>

      <div className="upload-box">
        <label htmlFor="pdfUpload" className="upload-label">
          Browse File:
        </label>
        <input
          id="pdfUpload"
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {infoMessage && <p className="upload-info">{infoMessage}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Street</th>
            <th>Pincode</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.state}</td>
              <td>{row.street}</td>
              <td>{row.pincode}</td>
              <td className="file-column">
                {row.uploadStatus === "uploading" ? (
                  <div className="inline-progress">
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${row.progress}%` }} />
                    </div>
                    <span className="progress-inline-text">{row.progress}%</span>
                  </div>
                ) : row.uploadStatus === "stored" ? (
                  <FileSuccessIcon />
                ) : (
                  <span className="file-empty">Not uploaded</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
