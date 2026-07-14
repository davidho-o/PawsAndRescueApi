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
        else console.error("The server has denied the deleting of the dog.");
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
            placeholder="Nume..."
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rasă..."
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
            placeholder="Notițe..."
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
        Avem <strong>{dogs.length}</strong> câini în baza de date.
      </p>
      <ul style={{ listStyleType: "none", padding: 0 }}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
