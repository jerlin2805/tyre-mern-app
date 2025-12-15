
import { useEffect, useState } from "react";
import api from '../services/api';
import VehicleCard from "../components/VehicleCard";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data || []);
    } catch (err) {
      console.error(err);
      setVehicles([]);
    }
  };

  const removeVehicleFromUI = (id) => {
    setVehicles((prev) => prev.filter((v) => v._id !== id));
  };


  return (
    <>
      <Navigation />
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2>Vehicles</h2>

        <div style={{ marginTop: "20px" }}>
          {vehicles.length === 0 && <p>No vehicles found. Click "Add Vehicle" to add your first vehicle.</p>}

          {vehicles.map((v) => (
            <VehicleCard
              key={v._id}
              vehicle={v}
              onDelete={removeVehicleFromUI}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Vehicles;
