import { useState, useEffect } from "react";

function VehicleForm({ onSubmit, editingVehicle, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "",
    brand: "",
    registrationNumber: "",
    registrationExpiry: "",
    notes: "",
  });

  const [customType, setCustomType] = useState("");

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        vehicleNumber: editingVehicle.vehicleNumber || "",
        vehicleType: editingVehicle.vehicleType || "",
        brand: editingVehicle.brand || "",
        registrationNumber: editingVehicle.registrationNumber || "",
        registrationExpiry: editingVehicle.registrationExpiry
          ? new Date(editingVehicle.registrationExpiry).toISOString().slice(0, 10)
          : "",
        notes: editingVehicle.notes || "",
      });
      if (editingVehicle.vehicleType && !["Car", "Bike", "Truck", "Other"].includes(editingVehicle.vehicleType)) {
        setCustomType(editingVehicle.vehicleType);
        setFormData((f) => ({ ...f, vehicleType: "Other" }));
      } else {
        setCustomType("");
      }
    } else {
      setFormData({
        vehicleNumber: "",
        vehicleType: "",
        brand: "",
        registrationNumber: "",
        registrationExpiry: "",
        notes: "",
      });
      setCustomType("");
    }
  }, [editingVehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalType = formData.vehicleType === "Other" ? customType.trim() : formData.vehicleType;

    if (!formData.vehicleNumber || !finalType || !formData.brand) {
      // basic validation: required fields
      alert("Please fill vehicle number, type and brand");
      return;
    }

    const payload = {
      vehicleNumber: formData.vehicleNumber,
      vehicleType: finalType,
      brand: formData.brand,
      registrationNumber: formData.registrationNumber || undefined,
      registrationExpiry: formData.registrationExpiry || undefined,
      notes: formData.notes || undefined,
    };

    onSubmit(payload);

    // reset only when not editing
    if (!editingVehicle) {
      setFormData({
        vehicleNumber: "",
        vehicleType: "",
        brand: "",
        registrationNumber: "",
        registrationExpiry: "",
        notes: "",
      });
      setCustomType("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</h3>

      <input
        name="vehicleNumber"
        placeholder="Vehicle Number"
        value={formData.vehicleNumber}
        onChange={handleChange}
        required
      />

      <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
        <option value="">Select Vehicle Type</option>
        <option value="Car">Car</option>
        <option value="Bike">Bike</option>
        <option value="Truck">Truck</option>
        <option value="Other">Other</option>
      </select>

      {formData.vehicleType === "Other" && (
        <input
          name="customType"
          placeholder="Enter vehicle type"
          value={customType}
          onChange={(e) => setCustomType(e.target.value)}
          required
        />
      )}

      <input
        name="brand"
        placeholder="Brand"
        value={formData.brand}
        onChange={handleChange}
        required
      />

      <input
        name="registrationNumber"
        placeholder="Registration Number"
        value={formData.registrationNumber}
        onChange={handleChange}
      />

      <input
        type="date"
        name="registrationExpiry"
        placeholder="Registration Expiry"
        value={formData.registrationExpiry}
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={handleChange}
      />

      <button type="submit">{editingVehicle ? "Update" : "Add"}</button>

      {editingVehicle && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default VehicleForm;
