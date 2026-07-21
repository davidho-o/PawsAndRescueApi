import { useEffect, useState, type SyntheticEvent } from "react";
import "./Users.css";

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

    fetch(`http://localhost:5230/api/Users/${id}`, { method: "DELETE" })
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
    <div className="users-container">
      <h2>We currently have {users.length} users.</h2>

      {/* MANAGERS / COORDINATORS */}
      <h3 className="section-title">Managers</h3>
      <ul className="users-list">
        {users
          .filter((user) => user.role === 1)
          .map((user) => (
            <li key={user.id} className="user-card">
              <span className="user-info">
                <strong>{user.name}</strong> <br />
                <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                  {user.email}
                </span>
              </span>
              <div className="btn-group">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
      </ul>

      {/* VOLUNTEERS */}
      <h3 className="section-title">Volunteers</h3>
      <ul className="users-list">
        {users
          .filter((user) => user.role === 0)
          .map((user) => (
            <li key={user.id} className="user-card">
              <span className="user-info">
                <strong>{user.name}</strong> <br />
                <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                  {user.email}
                </span>
              </span>
              <div className="btn-group">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
      </ul>

      {/* ADD USER FORM */}
      <div className="form-container">
        <h3>Add a new user</h3>
        <form className="form-layout" onSubmit={handleAddUser}>
          <input
            className="custom-input"
            required
            type="text"
            placeholder="Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="custom-input"
            required
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="custom-input"
            required
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Add user
          </button>
        </form>
      </div>

      {/* EDIT USER POPUP */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, color: "var(--color-teal-dark)" }}>
              Modify User
            </h3>
            <form className="form-layout" onSubmit={handleSaveEditUser}>
              <input
                className="custom-input"
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
                className="custom-input"
                type="email"
                placeholder="Email..."
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    email: e.target.value,
                  })
                }
              />
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={Boolean(editingUser.role)}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: Number(e.target.checked),
                    })
                  }
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                Promote to manager
              </label>

              <div className="btn-group" style={{ marginTop: "10px" }}>
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
                  onClick={() => setEditingUser(null)}
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
