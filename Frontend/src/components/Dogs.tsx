import { useState, useEffect, type SyntheticEvent } from "react";
import "./Dogs.css"; // <-- Importăm stilurile noastre

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
    <div className="dogs-container">
      <h3 className="section-title">
        We have {dogs.length} dogs in the database
      </h3>

      <ul className="dogs-list">
        {dogs.map((dog) => (
          <li key={dog.id} className="dog-card">
            <div className="dog-info">
              <strong>{dog.name}</strong> ({dog.breed})
              <small>
                <em>{dog.temperament}</em>
                <br />
                <em>{dog.notes}</em>
              </small>
            </div>

            <div className="btn-group">
              <button
                onClick={() => handleDeleteDog(dog.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
              <button
                onClick={() => setEditingDog(dog)}
                className="btn btn-primary"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="form-container">
        <h3 style={{ marginTop: 0, color: "var(--color-teal-dark)" }}>
          Add a new dog
        </h3>
        <form onSubmit={handleAddDog} className="form-layout">
          <input
            className="custom-input"
            type="text"
            placeholder="Name..."
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="custom-input"
            type="text"
            placeholder="Breed..."
            required
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
          <input
            className="custom-input"
            type="text"
            placeholder="Temperament..."
            value={temperament}
            onChange={(e) => setTemperament(e.target.value)}
          />
          <input
            className="custom-input"
            type="text"
            placeholder="Notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
          >
            + Add Dog
          </button>
        </form>
      </div>

      {editingDog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, color: "var(--color-teal-dark)" }}>
              Modify dog
            </h3>

            <form onSubmit={handleSaveEditDog} className="form-layout">
              <input
                className="custom-input"
                type="text"
                required
                value={editingDog.name}
                onChange={(e) =>
                  setEditingDog({ ...editingDog, name: e.target.value })
                }
              />
              <input
                className="custom-input"
                type="text"
                required
                value={editingDog.breed}
                onChange={(e) =>
                  setEditingDog({ ...editingDog, breed: e.target.value })
                }
              />
              <input
                className="custom-input"
                type="text"
                value={editingDog.temperament}
                onChange={(e) =>
                  setEditingDog({ ...editingDog, temperament: e.target.value })
                }
              />
              <input
                className="custom-input"
                type="text"
                value={editingDog.notes}
                onChange={(e) =>
                  setEditingDog({ ...editingDog, notes: e.target.value })
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
                  onClick={() => setEditingDog(null)}
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
