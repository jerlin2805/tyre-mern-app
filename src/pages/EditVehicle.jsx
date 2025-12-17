import { useEffect, useState } from "react";
import api from '../services/api';
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    brand: "",
    notes: "",
  });

  const [customType, setCustomType] = useState("");
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    api.get('/vehicles').then((res) => {
      const foundVehicle = res.data?.find(v => v._id === id);
      if (foundVehicle) {
        setVehicle(foundVehicle);
        setForm({
          vehicleNumber: foundVehicle.vehicleNumber || "",
          vehicleType: foundVehicle.vehicleType || "",
          brand: foundVehicle.brand || "",
          notes: foundVehicle.notes || "",
        });
        if (foundVehicle.vehicleType && !["Car", "Bike", "Truck", "Other"].includes(foundVehicle.vehicleType)) {
          setCustomType(foundVehicle.vehicleType);
        }
      }
    }).catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalType = form.vehicleType === "Other" ? customType.trim() : form.vehicleType;

    if (!form.vehicleNumber || !finalType || !form.brand) {
      alert("Please fill vehicle number, type and brand");
      return;
    }

    const payload = {
      vehicleNumber: form.vehicleNumber,
      vehicleType: finalType,
      brand: form.brand,
      notes: form.notes || undefined,
    };

    try {
      await api.put(`/vehicles/${id}`, payload);
      navigate("/vehicles");
    } catch (err) {
      console.error(err);
      alert("Failed to update vehicle");
    }
  };

  if (!vehicle) {
    return (
      <>
        <Navigation />
        <div style={{ padding: "20px" }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Edit Vehicle</h2>

          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="Vehicle Number"
              required
            />

            <select 
              style={styles.input}
              name="vehicleType" 
              value={form.vehicleType} 
              onChange={handleChange}
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
              <option value="Other">Other</option>
            </select>

            {form.vehicleType === "Other" && (
              <input
                style={styles.input}
                name="customType"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Enter vehicle type"
                required
              />
            )}

            <input
              style={styles.input}
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              required
            />

            <textarea
              style={styles.textarea}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
            />

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.updateButton}>
                Update Vehicle
              </button>
              <button type="button" style={styles.cancelButton} onClick={() => navigate("/vehicles")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditVehicle;

const styles = {
  container: {
    minHeight: "calc(100vh - 60px)",
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

  textarea: {
    width: "100%",
    padding: "12px",
    margin: "12px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    minHeight: "100px",
    resize: "vertical",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  updateButton: {
    flex: 1,
    padding: "12px",
    background: "#e76995ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  cancelButton: {
    flex: 1,
    padding: "12px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
