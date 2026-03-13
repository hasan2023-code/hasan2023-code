import React, { useEffect, useMemo, useState, useCallback } from "react";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { fetchEmployees } from "./api.js";

const columns = [
  { key: "empId", name: "Emp ID", width: 100 },
  { key: "empName", name: "Emp Name", resizable: true },
  { key: "address", name: "Address", resizable: true }
];

export default function App() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchEmpId, setSearchEmpId] = useState("");
  const [searchEmpName, setSearchEmpName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchEmployees()
      .then((data) => {
        if (!isMounted) return;
        setAllEmployees(data);
        setRows(data);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to load employees.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = () => {
    const id = searchEmpId.trim().toLowerCase();
    const name = searchEmpName.trim().toLowerCase();
    const addr = searchAddress.trim().toLowerCase();

    setLoading(true);
    setError("");

    fetchEmployees()
      .then((data) => {
        setAllEmployees(data);

        const filtered = data.filter((emp) => {
          const matchesId =
            id === "" || String(emp.empId).toLowerCase().includes(id);
          const matchesName =
            name === "" || emp.empName.toLowerCase().includes(name);
          const matchesAddress =
            addr === "" || emp.address.toLowerCase().includes(addr);
          return matchesId && matchesName && matchesAddress;
        });

        setRows(filtered);
      })
      .catch(() => {
        setError("Failed to search employees.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    setSearchEmpId("");
    setSearchEmpName("");
    setSearchAddress("");
    setRows(allEmployees);
  };

  const rowKeyGetter = useMemo(() => (row) => row.empId || "no-data", []);

  const hasAnySearch =
    searchEmpId.trim() !== "" ||
    searchEmpName.trim() !== "" ||
    searchAddress.trim() !== "";

  // Rows to actually show in the grid. If a search was performed
  // and no matching employees are found, keep headers but show a
  // single row with a "no data" message.
  const displayRows = useMemo(() => {
    if (!loading && !error && hasAnySearch && rows.length === 0) {
      return [
        {
          empId: null,
          empName: "No search data found",
          address: ""
        }
      ];
    }

    return rows;
  }, [rows, loading, error, hasAnySearch]);

  const rowClass = useCallback(
    (row) =>
      row.empName === "No search data found" ? "rdg-row-no-data" : undefined,
    []
  );

  return (
    <div className="app-root">
      <h1 className="app-title">Employee Search (React Data Grid)</h1>

      <section className="search-panel">
        <div className="field-group">
          <label htmlFor="empId">Emp ID</label>
          <input
            id="empId"
            type="text"
            value={searchEmpId}
            onChange={(e) => setSearchEmpId(e.target.value)}
            placeholder="e.g. 101"
          />
        </div>

        <div className="field-group">
          <label htmlFor="empName">Emp Name</label>
          <input
            id="empName"
            type="text"
            value={searchEmpName}
            onChange={(e) => setSearchEmpName(e.target.value)}
            placeholder="e.g. John"
          />
        </div>

        <div className="field-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="e.g. New York"
          />
        </div>

        <div className="button-row">
          <button type="button" onClick={handleSearch} className="primary-btn">
            Search
          </button>
          <button type="button" onClick={handleReset} className="secondary-btn">
            Reset
          </button>
        </div>
      </section>

      <section className="grid-wrapper">
        {loading && <div className="status-message">Loading employees...</div>}
        {error && <div className="status-message error">{error}</div>}

        {!loading && !error && (
          <DataGrid
            columns={columns}
            rows={displayRows}
            rowKeyGetter={rowKeyGetter}
            rowClass={rowClass}
            className="rdg-light"
          />
        )}
      </section>
    </div>
  );
}

