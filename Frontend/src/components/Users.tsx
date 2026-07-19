import { useEffect, useState, type SyntheticEvent } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: number; // 0 - volunteer, 1 - manager
  signedAgreements: boolean;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0);
  const [signedAgreements, setSignedAgreements] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:5230/api/Users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

  const handleAddUser = (e: SyntheticEvent) => {
    e.preventDefault();

    const newUser = {
      id: 0,
      name: name,
      email: email,
      password: password,
      role: role,
      signedAgreements: signedAgreements,
    };

    fetch("http://localhost:5230/api/Users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((addedUser) => {
        setUsers((prevUsers) => [...prevUsers, addedUser]);
        setName("");
        setEmail("");
        setPassword("");
        setRole(0);
        setSignedAgreements(false);
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteUser = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    fetch(`http://localhost:5230/api/users/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } else console.error("The server has denied deleting the user.");
      })
      .catch((error) => console.error(error));
  };

  const handleSaveEditUser = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    fetch(`http://localhost:5230/api/Users/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingUser),
    })
      .then((response) => {
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === editingUser.id ? editingUser : user,
            ),
          );
          setEditingUser(null);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h3>We currently have {users.length} users.</h3>
      <ul style={{ listStyleType: "none", padding: 0, gap: "10px" }}>
        {users.map((user) => (
          <li
            key={user.id}
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
            {user.name}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={() => handleDeleteUser(user.id)}
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
                onClick={() => setEditingUser(user)}
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
        <h3>Add a new user</h3>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          onSubmit={handleAddUser}
        >
          <input
            required
            type="text"
            placeholder="Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            type="text"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="text"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Add user
          </button>
        </form>
      </div>
      {editingUser && (
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
            <h3>Modify User</h3>
            <form
              onSubmit={handleSaveEditUser}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="Name..."
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    name: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Email..."
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    email: e.target.value,
                  })
                }
              />
              <input
                type="checkbox"
                checked={Boolean(editingUser.role)}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    role: Number(e.target.checked),
                  })
                }
                style={{ transform: "scale(1.2)", cursor: "pointer" }}
              />
              Promote to manager
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
                  onClick={() => setEditingUser(null)}
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
