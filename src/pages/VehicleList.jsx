import { useEffect, useState } from "react";

import api from "../services/api";

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    api.get("/vehicles").then(res => setVehicles(res.data));
  }, []);

  const remove = async id => {
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>My Vehicles</h2>
      {vehicles.map(v => (
        <div key={v._id}>
          <p>{v.vehicleNumber || v.name} - {v.vehicleType || v.number}</p>
          <button onClick={() => remove(v._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
