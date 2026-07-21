import { useState, useEffect, type SyntheticEvent } from "react";
import "./Shifts.css"; // <-- Importăm noul CSS

const CURRENT_LOGGED_IN_VOLUNTEER_ID = 1; // hardcoded the volunteer id

interface Shift {
  id: number;
  date: string;
  hourBegin: string;
  hourEnd: string;
  volunteerId: number;
  backupVolunteerId: number | null;
  isApproved: boolean;
}

export default function Shifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [date, setDate] = useState("");
  const [hourBegin, setHourBegin] = useState("");
  const [hourEnd, setHourEnd] = useState("");
  const [backupVolunteerId, setBackupVolunteerId] = useState<number | null>(
    null,
  );

  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  useEffect(() => {
    fetch("http://localhost:5230/api/Shifts")
      .then((response) => response.json())
      .then((data) => setShifts(data))
      .catch((error) => console.error(error));
  }, []);

  const handleAddShift = (e: SyntheticEvent) => {
    e.preventDefault();

    const newShift = {
      id: 0,
      date: date,
      hourBegin: hourBegin,
      hourEnd: hourEnd,
      volunteerId: CURRENT_LOGGED_IN_VOLUNTEER_ID,
      backupVolunteerId: backupVolunteerId,
    };

    fetch("http://localhost:5230/api/Shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newShift),
    })
      .then((response) => response.json())
      .then((addedShift) => {
        setShifts((prevShifts) => [...prevShifts, addedShift]);
        setDate("");
        setHourBegin("");
        setHourEnd("");
        setBackupVolunteerId(null);
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteShift = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;

    fetch(`http://localhost:5230/api/Shifts/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setShifts((prevShifts) =>
            prevShifts.filter((shift) => shift.id !== id),
          );
        } else console.error("The server has denied deleting the shift.");
      })
      .catch((error) => console.error(error));
  };

  const handleSaveEditShift = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!editingShift) return;

    fetch(`http://localhost:5230/api/Shifts/${editingShift.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingShift),
    })
      .then((response) => {
        if (response.ok) {
          setShifts((prevShifts) =>
            prevShifts.map((shift) =>
              shift.id === editingShift.id ? editingShift : shift,
            ),
          );
          setEditingShift(null);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="shifts-container">
      <h2 className="section-title">
        We have {shifts.length} shifts at the moment.
      </h2>

      {/* ADD FORM */}
      <div className="form-container">
        <form onSubmit={handleAddShift} className="form-layout">
          <h3 style={{ marginTop: 0, color: "var(--color-teal-dark)" }}>
            Add a new shift
          </h3>

          <div className="input-group">
            <p>Date: </p>
            <input
              type="date"
              required
              className="custom-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <p>Starting Hour: </p>
            <input
              type="time"
              required
              className="custom-input"
              value={hourBegin}
              onChange={(e) => setHourBegin(e.target.value)}
            />
          </div>

          <div className="input-group">
            <p>Ending Hour: </p>
            <input
              type="time"
              required
              className="custom-input"
              value={hourEnd}
              onChange={(e) => setHourEnd(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
          >
            Add shift
          </button>
        </form>
      </div>

      {/* SHIFT LIST */}
      <ul className="shifts-list">
        {shifts.map((shift) => (
          <li key={shift.id} className="shift-card">
            <div className="shift-info">
              <h3>Shift #{shift.id}</h3>
              <span className="badge badge-date">
                {new Date(shift.date).toLocaleDateString()}
              </span>
              <span className="time-text">
                {shift.hourBegin} - {shift.hourEnd}
              </span>
              <span
                className={`badge ${shift.isApproved ? "badge-approved" : "badge-pending"}`}
              >
                {shift.isApproved ? "Approved" : "Pending"}
              </span>
            </div>

            <div className="btn-group">
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteShift(shift.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setEditingShift(shift)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit pop-up */}
      {editingShift && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, color: "var(--color-teal-dark)" }}>
              Modify shift
            </h3>

            <form onSubmit={handleSaveEditShift} className="form-layout">
              <input
                type="date"
                className="custom-input"
                value={editingShift.date.split("T")[0]}
                onChange={(e) =>
                  setEditingShift({
                    ...editingShift,
                    date: e.target.value,
                  })
                }
              />
              <input
                type="time"
                className="custom-input"
                value={editingShift.hourBegin}
                onChange={(e) =>
                  setEditingShift({
                    ...editingShift,
                    hourBegin: e.target.value,
                  })
                }
              />
              <input
                type="time"
                className="custom-input"
                value={editingShift.hourEnd}
                onChange={(e) =>
                  setEditingShift({
                    ...editingShift,
                    hourEnd: e.target.value,
                  })
                }
              />

              <label
                className="input-group"
                style={{ cursor: "pointer", marginTop: "10px" }}
              >
                <input
                  type="checkbox"
                  checked={editingShift.isApproved}
                  onChange={(e) =>
                    setEditingShift({
                      ...editingShift,
                      isApproved: e.target.checked,
                    })
                  }
                  style={{ width: "18px", height: "18px" }}
                />
                Manager Approval
              </label>

              <div className="btn-group" style={{ marginTop: "15px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setEditingShift(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
