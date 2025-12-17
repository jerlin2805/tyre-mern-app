import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import Navigation from '../components/Navigation';

function AddVehicle() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [brand, setBrand] = useState("");
  
  const [message, setMessage] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [customType, setCustomType] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data || []);
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
        let res;
        if (editingId) {
          res = await api.put(`/vehicles/${editingId}`, {
            vehicleNumber,
            vehicleType: finalType,
            brand,
          });
        } else {
          res = await api.post('/vehicles', {
            vehicleNumber,
            vehicleType: finalType,
            brand,
          });
        }

        if (!res || (res.status && res.status >= 400)) {
          setMessage('Failed to add/update vehicle');
          return;
        }

        setMessage(editingId ? 'Vehicle updated successfully' : 'Vehicle added successfully');

        // clear form
        setVehicleNumber('');
        setVehicleType('');
        setCustomType('');
        setBrand('');

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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setVehicleNumber('');
    setVehicleType('');
    setCustomType('');
    setBrand('');
    
    setMessage('');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
      setMessage('Vehicle deleted');
      fetchVehicles();
    } catch (err) {
      console.error(err);
      setMessage('Delete failed');
    }
  };

  return (
    <>
      <Navigation />
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

          <button style={styles.button} onClick={handleSubmit}>
            {editingId ? 'Update Vehicle' : 'Add Vehicle'}
          </button>

          {message && <p style={styles.message}>{message}</p>}
          
          {editingId && (
            <button style={styles.cancelButton} onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>

        {/* Vehicle List */}
        <div style={styles.vehicleList}>
          <h3 style={styles.listTitle}>My Vehicles</h3>
          {vehicles.length === 0 ? (
            <p style={styles.emptyMessage}>No vehicles added yet.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v._id} style={styles.vehicleItem}>
                <div style={styles.vehicleInfo}>
                  <strong>{v.vehicleNumber}</strong> - {v.vehicleType} - {v.brand}
                </div>
                <div style={styles.vehicleActions}>
                  <button style={styles.editButton} onClick={() => handleEdit(v)}>
                    Edit
                  </button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(v._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default AddVehicle;

const styles = {
  container: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#f4f4f4",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
    gap: "20px",
    flexWrap: "wrap",
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

  cancelButton: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#6c757d",
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

  vehicleList: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },

  listTitle: {
    marginBottom: "20px",
    color: "#333",
    fontWeight: "600",
  },

  emptyMessage: {
    color: "#666",
    textAlign: "center",
  },

  vehicleItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },

  vehicleInfo: {
    flex: 1,
    color: "#333",
  },

  vehicleActions: {
    display: "flex",
    gap: "10px",
  },


  editButton: {
    background: "#e76995ff",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },

  deleteButton: {
    background: "#e76995ff",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};
