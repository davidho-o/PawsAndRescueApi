import { useState, useEffect, type SyntheticEvent } from "react";

interface Dog {
  id: number;
  name: string;
  breed: string;
  temperament: string;
  notes: string;
}

export default function Dogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [temperament, setTemperament] = useState("");
  const [notes, setNotes] = useState("");

  const [editingDog, setEditingDog] = useState<Dog | null>(null);

  useEffect(() => {
    fetch("http://localhost:5230/api/Dogs")
      .then((response) => response.json())
      .then((data) => setDogs(data))
      .catch((error) => console.error("Connection error:", error));
  }, []);

  const handleAddDog = (e: SyntheticEvent) => {
    e.preventDefault();

    const newDog = {
      id: 0,
      name: name,
      breed: breed,
      temperament: temperament,
      notes: notes,
      photoUrl: "",
    };

    fetch("http://localhost:5230/api/Dogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDog),
    })
      .then((response) => response.json())
      .then((addedDog) => {
        setDogs([...dogs, addedDog]);
        setName("");
        setBreed("");
        setTemperament("");
        setNotes("");
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteDog = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this dog?")) return;

    fetch(`http://localhost:5230/api/Dogs/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) setDogs(dogs.filter((dog) => dog.id !== id));
        else console.error("The server has denied deleting of the dog.");
      })
      .catch((error) => console.error(error));
  };

  const handleSaveEditDog = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!editingDog) return;

    fetch(`http://localhost:5230/api/Dogs/${editingDog.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingDog),
    })
      .then((response) => {
        if (response.ok) {
          setDogs(
            dogs.map((dog) => (dog.id === editingDog.id ? editingDog : dog)),
          );
          setEditingDog(null);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
        }}
      >
        <h3>Add a new dog</h3>
        <form
          onSubmit={handleAddDog}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Name..."
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Breed..."
            required
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
          <input
            type="text"
            placeholder="Temperament..."
            value={temperament}
            onChange={(e) => setTemperament(e.target.value)}
          />
          <input
            type="text"
            placeholder="Notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            + Add Dog
          </button>
        </form>
      </div>

      <p>
        We have <strong>{dogs.length}</strong> dogs in the database
      </p>
      <ul style={{ listStyleType: "none", padding: 0, gap: "10px" }}>
        {dogs.map((dog) => (
          <li
            key={dog.id}
            style={{
              marginBottom: "10px",
              padding: "12px",
              border: "2px solid #ddd",
              borderRadius: "6px",
              maxWidth: "400px",
              display: "flex",
              justifyContent: "space-between", //text right and button left
              alignItems: "center",
              gap: "30px",
            }}
          >
            <div>
              <strong>{dog.name}</strong> ({dog.breed}) <br />
              <small style={{ color: "#666" }}>
                <em>{dog.temperament}</em>
                <br></br>
                <em>{dog.notes}</em>
              </small>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button
                onClick={() => handleDeleteDog(dog.id)}
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
                onClick={() => setEditingDog(dog)}
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
      {editingDog && (
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
            <h3>Modify dog</h3>

            <form
              onSubmit={handleSaveEditDog}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                required
                value={editingDog.name}
                onChange={(e) =>
                  setEditingDog({ ...editingDog, name: e.target.value })
                }
              />
              <input
                type="text"
                required
                value={editingDog.breed}
                onChange={(e) =>
                  setEditingDog({ ...editingDog, breed: e.target.value })
                }
              />
              <input
                type="text"
                value={editingDog.temperament}
                onChange={(e) =>
                  setEditingDog({ ...editingDog, temperament: e.target.value })
                }
              />
              <input
                type="text"
                value={editingDog.notes}
                onChange={(e) =>
                  setEditingDog({ ...editingDog, notes: e.target.value })
                }
              />

              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingDog(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
