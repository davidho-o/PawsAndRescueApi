import { useState, useEffect, type SyntheticEvent } from "react";
import "./ShelterTasks.css"; // <-- Importăm stilurile

interface ShelterTask {
  id: number;
  description: string;
  isCompleted: boolean;
  shiftId: number;
  dogId: number;
}

export default function ShelterTasks() {
  const [shelterTasks, setShelterTasks] = useState<ShelterTask[]>([]);

  const [description, setDescription] = useState("");
  const [shiftId, setShiftId] = useState(0);
  const [dogId, setDogId] = useState(0);

  const [editingTask, setEditingTask] = useState<ShelterTask | null>(null);

  useEffect(() => {
    fetch("http://localhost:5230/api/ShelterTasks")
      .then((response) => response.json())
      .then((data) => setShelterTasks(data))
      .catch((error) => console.error(error));
  }, []);

  const handleToggleCheck = (task: ShelterTask) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };

    fetch(`http://localhost:5230/api/ShelterTasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => {
        if (response.ok) {
          setShelterTasks((prevTasks) =>
            prevTasks.map((shelterTask) =>
              shelterTask.id === updatedTask.id ? updatedTask : shelterTask,
            ),
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddTask = (e: SyntheticEvent) => {
    e.preventDefault();

    const newTask = {
      id: 0,
      description: description,
      shiftId: shiftId,
      dogId: dogId,
    };

    fetch("http://localhost:5230/api/ShelterTasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((addedTask) => {
        setShelterTasks((prevTasks) => [...prevTasks, addedTask]);
        setDescription("");
        setShiftId(0);
        setDogId(0);
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteTask = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    fetch(`http://localhost:5230/api/ShelterTasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok)
          setShelterTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== id),
          );
        else console.error("The server has denied deleting the task.");
      })
      .catch((error) => console.error(error));
  };

  const handleSaveEditTask = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!editingTask) return;

    fetch(`http://localhost:5230/api/ShelterTasks/${editingTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingTask),
    })
      .then((response) => {
        if (response.ok) {
          setShelterTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === editingTask.id ? editingTask : task,
            ),
          );
          setEditingTask(null);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="tasks-container">
      <h2 className="section-title">
        We have {shelterTasks.length} tasks to complete.
      </h2>

      {/* TASK LIST */}
      <ul className="tasks-list">
        {shelterTasks.map((shelterTask) => (
          <li
            key={shelterTask.id}
            className={`task-card ${shelterTask.isCompleted ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              className="task-checkbox"
              checked={shelterTask.isCompleted}
              onChange={() => handleToggleCheck(shelterTask)}
            />

            <div className="task-content">
              <span className="task-description">
                {shelterTask.description}
              </span>
              <span className="task-meta">
                Dog ID: {shelterTask.dogId} | Shift: {shelterTask.shiftId}
              </span>
            </div>

            <div className="btn-group">
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteTask(shelterTask.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setEditingTask(shelterTask)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ADD SHIFT FORM */}
      <div className="form-container">
        <h3 style={{ marginTop: 0, color: "var(--color-teal-dark)" }}>
          Add a new task
        </h3>
        <form onSubmit={handleAddTask} className="form-layout">
          <input
            className="custom-input"
            type="text"
            placeholder="Description..."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="input-row">
            <input
              className="custom-input"
              type="number"
              placeholder="Shift ID..."
              value={shiftId === 0 ? "" : shiftId}
              onChange={(e) => setShiftId(Number(e.target.value))}
            />
            <input
              className="custom-input"
              type="number"
              placeholder="Dog ID..."
              value={dogId === 0 ? "" : dogId}
              onChange={(e) => setDogId(Number(e.target.value))}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
          >
            + Add Task
          </button>
        </form>
      </div>

      {/* EDIT SHIFT POP-UP */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, color: "var(--color-teal-dark)" }}>
              Modify task
            </h3>
            <form onSubmit={handleSaveEditTask} className="form-layout">
              <input
                className="custom-input"
                type="text"
                required
                placeholder="Description..."
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
              />

              <div className="btn-group-row">
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
                  onClick={() => setEditingTask(null)}
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
