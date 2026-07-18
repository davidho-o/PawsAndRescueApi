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
        setShelterTasks([...shelterTasks, addedTask]);
        setDescription("");
        setShiftId(0);
        setDogId(0);
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
    </div>
  );
}
