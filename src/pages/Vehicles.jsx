import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchVehicles();
  }, []);

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

  const handleEdit = (v) => {
    navigate('/add-vehicle', { state: { editVehicle: v } });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Vehicles</h2>
        <button onClick={() => navigate('/add-vehicle')} style={{ padding: '8px 12px', borderRadius: 6, background: '#e76995ff', color: '#fff', border: 'none' }}>Add Vehicle</button>
      </div>

      {message && <p style={{ color: '#28a745' }}>{message}</p>}

      {vehicles.length === 0 ? (
        <p style={{ color: '#666' }}>No vehicles yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {vehicles.map((v) => (
            <li key={v._id} style={{ marginBottom: 12, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{v.vehicleNumber}</strong> — {v.vehicleType} ({v.brand})
                  {v.registrationNumber && (
                    <div style={{ fontSize: 12, color: '#555' }}>Reg: {v.registrationNumber} (exp: {v.registrationExpiry ? new Date(v.registrationExpiry).toLocaleDateString() : '—'})</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleEdit(v)} style={{ padding: '6px 10px' }}>Edit</button>
                  <button onClick={() => handleDelete(v._id)} style={{ padding: '6px 10px' }}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
