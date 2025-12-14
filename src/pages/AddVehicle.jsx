import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

function AddVehicle() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [brand, setBrand] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationExpiry, setRegistrationExpiry] = useState("");
  
  const [message, setMessage] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [customType, setCustomType] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/vehicles', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return setVehicles([]);
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setVehicles([]);
    }
  };

  // fetch when mounted
  useEffect(() => {
    fetchVehicles();
  }, []);

  // if navigated here with an edit payload, prefill form
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.editVehicle) {
      const v = location.state.editVehicle;
      setEditingId(v._id);
      setVehicleNumber(v.vehicleNumber || '');
      setVehicleType(v.vehicleType || '');
      setCustomType('');
      setBrand(v.brand || '');
      setRegistrationNumber(v.registrationNumber || '');
      setRegistrationExpiry(v.registrationExpiry ? new Date(v.registrationExpiry).toISOString().slice(0,10) : '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const handleSubmit = () => {
    // determine final vehicle type (support "Other")
    const finalType = vehicleType === 'Other' ? customType.trim() : vehicleType;

    if (!vehicleNumber || !finalType || !brand) {
      setMessage("Please fill all the fields");
      return;
    }

    // send to backend (create or update)
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const url = editingId ? `http://localhost:5001/api/vehicles/${editingId}` : 'http://localhost:5001/api/vehicles';
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            vehicleNumber,
            vehicleType: finalType,
            brand,
            registrationNumber,
            registrationExpiry,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          setMessage('Failed to add vehicle: ' + text);
          return;
        }

  const created = await res.json();
  setMessage(editingId ? 'Vehicle updated successfully' : 'Vehicle added successfully');
  // clear form
  setVehicleNumber('');
  setVehicleType('');
  setCustomType('');
  setBrand('');
  setRegistrationNumber('');
  setRegistrationExpiry('');
  
        // refresh list
        fetchVehicles();
        // clear editing state
        setEditingId(null);
      } catch (err) {
        console.error(err);
        setMessage('Failed to add vehicle');
      }
    })();
  };

  const handleEdit = (v) => {
    setEditingId(v._id);
    setVehicleNumber(v.vehicleNumber || '');
    setVehicleType(v.vehicleType || '');
    setCustomType('');
    setBrand(v.brand || '');
    setRegistrationNumber(v.registrationNumber || '');
    setRegistrationExpiry(v.registrationExpiry ? new Date(v.registrationExpiry).toISOString().slice(0,10) : '');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setVehicleNumber('');
    setVehicleType('');
    setCustomType('');
    setBrand('');
    setRegistrationNumber('');
    setRegistrationExpiry('');
    
    setMessage('');
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        setMessage('Delete failed: ' + txt);
        return;
      }
      setMessage('Vehicle deleted');
      fetchVehicles();
    } catch (err) {
      console.error(err);
      setMessage('Delete failed');
    }
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
          <option value="Other">Other</option>
        </select>

        {vehicleType === 'Other' && (
          <input
            type="text"
            placeholder="Enter vehicle type"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          type="text"
          placeholder="Vehicle Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Registration Number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          style={styles.input}
        />

        <input
          type="date"
          placeholder="Registration Expiry"
          value={registrationExpiry}
          onChange={(e) => setRegistrationExpiry(e.target.value)}
          style={styles.input}
        />

        {/* Tyre fields removed to simplify form */}

        <button style={styles.button} onClick={handleSubmit}>
          Add Vehicle
        </button>

        {message && <p style={styles.message}>{message}</p>}
        {/* Vehicles list moved to separate page */}
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
    background: "#e76995ff",
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
