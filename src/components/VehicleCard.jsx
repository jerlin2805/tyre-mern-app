import { useNavigate } from "react-router-dom";
import axios from "axios";

function VehicleCard({ vehicle, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this vehicle?");
    if (!confirm) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/vehicles/${vehicle._id}`
      );
      onDelete(vehicle._id);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.card}>
      <h3>{vehicle.vehicleName}</h3>
      <p>Number: {vehicle.vehicleNumber}</p>
      <p>Type: {vehicle.vehicleType}</p>

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
