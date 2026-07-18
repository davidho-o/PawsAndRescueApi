import { useState, useEffect, type SyntheticEvent } from "react";

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

  //used to load the initial list of tasks
  useEffect(() => {
    fetch("http://localhost:5230/api/ShelterTasks")
      .then((response) => response.json())
      .then((data) => setShelterTasks(data))
      .catch((error) => console.error(error));
  }, []);

  //function that allows to (un)check a task
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

  //function that handles the adding of a task
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

  //function that handles the deleting of a task
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

  //allows for changing the description of a task
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
    <div>
      <p>We have {shelterTasks.length} tasks to complete.</p>

      <ul style={{ listStyleType: "none", padding: 0, gap: "10px" }}>
        {shelterTasks.map((shelterTask) => (
          <li
            key={shelterTask.id}
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
            <input
              type="checkbox"
              checked={shelterTask.isCompleted}
              onChange={() => handleToggleCheck(shelterTask)}
              style={{ transform: "scale(1.5)", cursor: "pointer" }}
            />
            <div
              style={{
                textDecoration: shelterTask.isCompleted
                  ? "line-through"
                  : "none",
              }}
            >
              <strong>{shelterTask.description}</strong>
              <br />
              <small style={{ color: "#666" }}>
                Dog ID: {shelterTask.dogId} | Shift: {shelterTask.shiftId}
              </small>
              <button
                onClick={() => handleDeleteTask(shelterTask.id)}
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
                onClick={() => setEditingTask(shelterTask)}
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
      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
        }}
      >
        <h3>Add a new task</h3>
        <form
          onSubmit={handleAddTask}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Description..."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Shift ID..."
            value={shiftId === 0 ? "" : shiftId}
            onChange={(e) => setShiftId(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Dog ID..."
            value={dogId === 0 ? "" : dogId}
            onChange={(e) => setDogId(Number(e.target.value))}
          />
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
            + Add Task
          </button>
        </form>
      </div>
      {editingTask && (
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
            <h3>Modify task</h3>
            <form
              onSubmit={handleSaveEditTask}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
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
                  onClick={() => setEditingTask(null)}
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
