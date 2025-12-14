import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vehicleName: "",
    vehicleNumber: "",
    vehicleType: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/vehicles/${id}`)
      .then((res) => setForm(res.data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:5000/api/vehicles/${id}`,
      form
    );

    navigate("/vehicles");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Vehicle</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="vehicleName"
          value={form.vehicleName}
          onChange={handleChange}
          placeholder="Vehicle Name"
        />
        <br />

        <input
          name="vehicleNumber"
          value={form.vehicleNumber}
          onChange={handleChange}
          placeholder="Vehicle Number"
        />
        <br />

        <input
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          placeholder="Vehicle Type"
        />
        <br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditVehicle;
