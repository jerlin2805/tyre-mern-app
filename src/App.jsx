import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AddVehicle from "./pages/AddVehicle";
import Vehicles from "./pages/Vehicles";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/add-vehicle"
        element={
          <ProtectedRoute>
            <AddVehicle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <Vehicles />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
