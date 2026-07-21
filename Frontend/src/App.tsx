import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dogs from "./components/Dogs/Dogs";
import ShelterTasks from "./components/ShelterTasks/ShelterTasks";
import Shifts from "./components/Shifts/Shifts";
import Users from "./components/Users/Users";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <Router>
      <Navbar />

      {/* Zona principală unde se randează componentele în funcție de URL */}
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Routes>
          {/* Redirecționează pagina principală către secțiunea de câini */}
          <Route path="/" element={<Navigate to="/dogs" replace />} />

          {/* Rutele aplicației */}
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/shifts" element={<Shifts />} />
          <Route path="/tasks" element={<ShelterTasks />} />

          {/* Rută de fallback pentru pagini inexistente (404) */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
