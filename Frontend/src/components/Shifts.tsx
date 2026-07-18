import { useState, useEffect, type SyntheticEvent } from "react";

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
    <div>
      <h3>We have {shifts.length} shifts at the moment.</h3>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
        }}
      >
        <form
          onSubmit={handleAddShift}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <h3>Add a new shift</h3>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <p>Date: </p>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <p>Starting Hour: </p>
            <input
              type="time"
              required
              value={hourBegin}
              onChange={(e) => setHourBegin(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <p>Ending Hour: </p>
            <input
              type="time"
              required
              value={hourEnd}
              onChange={(e) => setHourEnd(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add shift
          </button>
        </form>
      </div>
      <ul style={{ listStyleType: "none", padding: 0, gap: "10px" }}>
        {shifts.map((shift) => (
          <li
            key={shift.id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <h3>Shift #{shift.id}</h3>
            <p
              style={{
                backgroundColor: "#83d",
                padding: "5px",
                color: "white",
                borderRadius: "4px",
              }}
            >
              {new Date(shift.date).toLocaleDateString()}
            </p>
            <p>
              {shift.hourBegin} - {shift.hourEnd}
            </p>
            <p
              style={{
                backgroundColor: shift.isApproved ? "#4CAF50" : "#ff9800",
                color: "white",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {shift.isApproved ? "Approved" : "Pending"}
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={() => handleDeleteShift(shift.id)}
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setEditingShift(shift)}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editingShift && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Modify shift</h3>
            <form
              onSubmit={handleSaveEditShift}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="date"
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
                value={editingShift.hourEnd}
                onChange={(e) =>
                  setEditingShift({
                    ...editingShift,
                    hourEnd: e.target.value,
                  })
                }
              />
              <label
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
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
                  style={{ transform: "scale(1.2)", cursor: "pointer" }}
                />
                Manager Approval
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingShift(null)}
                  style={{
                    padding: "10px",
                    backgroundColor: "#ccc",
                    border: "none",
                    cursor: "pointer",
                  }}
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
