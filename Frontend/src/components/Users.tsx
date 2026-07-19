import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("http://localhost:5230/api/Users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

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
          </li>
        ))}
      </ul>
    </div>
  );
}
