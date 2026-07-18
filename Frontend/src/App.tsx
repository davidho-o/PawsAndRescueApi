import Dogs from "./components/Dogs";
import ShelterTasks from "./components/ShelterTasks";
import Shifts from "./components/Shifts";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🐾 Paws & Rescue Admin</h1>
      <Dogs />
      <br></br>
      <ShelterTasks />
      <br></br>
      <Shifts />
      <br></br>
    </div>
  );
}

export default App;
