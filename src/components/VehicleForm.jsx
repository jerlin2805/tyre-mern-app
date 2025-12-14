import { useState, useEffect } from "react";

function VehicleForm({ onSubmit, editingVehicle, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    model: "",
  });

  useEffect(() => {
    if (editingVehicle) {
      setFormData(editingVehicle);
    }
  }, [editingVehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", number: "", model: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</h3>

      <input
        name="name"
        placeholder="Vehicle Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        name="number"
        placeholder="Vehicle Number"
        value={formData.number}
        onChange={handleChange}
        required
      />

      <input
        name="model"
        placeholder="Model"
        value={formData.model}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {editingVehicle ? "Update" : "Add"}
      </button>

      {editingVehicle && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default VehicleForm;
