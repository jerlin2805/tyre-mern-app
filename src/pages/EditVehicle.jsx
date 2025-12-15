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
    registrationNumber: "",
    registrationExpiry: "",
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
          registrationNumber: foundVehicle.registrationNumber || "",
          registrationExpiry: foundVehicle.registrationExpiry 
            ? new Date(foundVehicle.registrationExpiry).toISOString().slice(0, 10) 
            : "",
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
      registrationNumber: form.registrationNumber || undefined,
      registrationExpiry: form.registrationExpiry || undefined,
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
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2>Edit Vehicle</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="vehicleNumber"
            value={form.vehicleNumber}
            onChange={handleChange}
            placeholder="Vehicle Number"
            required
          />
          <br />

          <select 
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
          <br />

          {form.vehicleType === "Other" && (
            <input
              name="customType"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              placeholder="Enter vehicle type"
              required
            />
          )}
          <br />

          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            required
          />
          <br />

          <input
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
            placeholder="Registration Number"
          />
          <br />

          <input
            type="date"
            name="registrationExpiry"
            value={form.registrationExpiry}
            onChange={handleChange}
            placeholder="Registration Expiry"
          />
          <br />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes"
          />
          <br />

          <button type="submit">Update</button>
          <button type="button" onClick={() => navigate("/vehicles")}>Cancel</button>
        </form>
      </div>
    </>
  );
}

export default EditVehicle;
