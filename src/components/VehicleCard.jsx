import { useNavigate } from "react-router-dom";
import api from '../services/api';

function VehicleCard({ vehicle, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this vehicle?");
    if (!confirm) return;

    try {
      await api.delete(`/vehicles/${vehicle._id}`);
      onDelete(vehicle._id);
    } catch (err) {
      alert("Delete failed");
    }
  };


  return (
    <div style={styles.card}>
      <h3>{vehicle.vehicleNumber}</h3>
      <p>Type: {vehicle.vehicleType}</p>
      <p>Brand: {vehicle.brand}</p>

      <div style={styles.btnGroup}>
        <button onClick={() => navigate(`/edit-vehicle/${vehicle._id}`)}>
          Edit
        </button>
        <button onClick={handleDelete} style={styles.delete}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
  },
  btnGroup: {
    display: "flex",
    gap: "10px",
  },
  delete: {
    background: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "5px 10px",
  },
};

export default VehicleCard;
