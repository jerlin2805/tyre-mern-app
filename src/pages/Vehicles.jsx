import { useEffect, useState } from "react";
import axios from "axios";
import VehicleCard from "../components/VehicleCard";
import { useNavigate } from "react-router-dom";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const res = await axios.get("http://localhost:5000/api/vehicles");
    setVehicles(res.data);
  };

  const removeVehicleFromUI = (id) => {
    setVehicles((prev) => prev.filter((v) => v._id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vehicles</h2>

      <button onClick={() => navigate("/add-vehicle")}>
        Add Vehicle
      </button>

      <div style={{ marginTop: "20px" }}>
        {vehicles.length === 0 && <p>No vehicles found</p>}

        {vehicles.map((v) => (
          <VehicleCard
            key={v._id}
            vehicle={v}
            onDelete={removeVehicleFromUI}
          />
        ))}
      </div>
    </div>
  );
}

export default Vehicles;
