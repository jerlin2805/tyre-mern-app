import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AddVehicle from "./pages/AddVehicle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
