import { useState } from "react";

function AddVehicle() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [message, setMessage] = useState("");

  const handleAddVehicle = () => {
    if (!vehicleNumber || !vehicleType) {
      setMessage("Please fill all fields");
      return;
    }

    setMessage("Vehicle added successfully 🚗");
    setVehicleNumber("");
    setVehicleType("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Add Vehicle</h2>

        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Vehicle Type (Car / Bike)"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleAddVehicle} style={styles.button}>
          Add Vehicle
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default AddVehicle;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  box: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  message: {
    marginTop: "10px",
    color: "green",
  },
};
