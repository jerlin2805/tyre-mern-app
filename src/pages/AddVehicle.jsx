import { useState } from "react";

function AddVehicle() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [brand, setBrand] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!vehicleNumber || !vehicleType || !brand) {
      setMessage("Please fill all the fields");
      return;
    }

    setMessage("Vehicle added successfully 🚗🛞");

    // clear form
    setVehicleNumber("");
    setVehicleType("");
    setBrand("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add Vehicle</h2>

        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          style={styles.input}
        />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Vehicle Type</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Truck">Truck</option>
        </select>

        <input
          type="text"
          placeholder="Vehicle Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleSubmit}>
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
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },

  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
    color: "#333",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "12px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#f15a24",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  message: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#28a745",
  },
};
