import { useState } from 'react';
import api from '../services/api';

function ServiceForm({ vehicles, onServiceAdded }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceDescription: '',
    serviceDate: new Date().toISOString().split('T')[0],
    serviceCost: '',
    serviceProvider: '',
    notes: '',
    nextServiceDate: '',
    serviceType: 'maintenance'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.vehicleId || !formData.serviceDescription || !formData.serviceDate) {
        alert('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const serviceData = {
        ...formData,
        serviceCost: formData.serviceCost ? parseFloat(formData.serviceCost) : 0
      };

      const response = await api.post('/services', serviceData);
      
      // Reset form
      setFormData({
        vehicleId: '',
        serviceDescription: '',
        serviceDate: new Date().toISOString().split('T')[0],
        serviceCost: '',
        serviceProvider: '',
        notes: '',
        nextServiceDate: '',
        serviceType: 'maintenance'
      });

      onServiceAdded(response.data);
      alert('Service added successfully!');
    } catch (err) {
      console.error('Failed to add service:', err);
      alert('Failed to add service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div style={styles.noVehiclesContainer}>
        <div style={styles.noVehiclesCard}>
          <h3 style={styles.noVehiclesTitle}>No Vehicles Available</h3>
          <p style={styles.noVehiclesText}>
            You need to add a vehicle first before you can add services.
          </p>
          <p style={styles.noVehiclesHint}>
            Go to "Add Vehicle" to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Add New Service</h2>
        <p style={styles.subtitle}>Track maintenance and service history for your vehicles</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          {/* Vehicle Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Vehicle <span style={styles.required}>*</span>
            </label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select a vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.vehicleNumber} - {vehicle.brand} ({vehicle.vehicleType})
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="maintenance">Maintenance</option>
              <option value="repair">Repair</option>
              <option value="inspection">Inspection</option>
              <option value="replacement">Replacement</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Service Description */}
          <div style={styles.formGroupFull}>
            <label style={styles.label}>
              Service Description <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleChange}
              placeholder="e.g., Oil change, Brake inspection, Tire rotation"
              style={styles.input}
              required
            />
          </div>

          {/* Service Date */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Service Date <span style={styles.required}>*</span>
            </label>
            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Service Cost */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Service Cost</label>
            <input
              type="number"
              name="serviceCost"
              value={formData.serviceCost}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              style={styles.input}
            />
          </div>

          {/* Service Provider */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Service Provider</label>
            <input
              type="text"
              name="serviceProvider"
              value={formData.serviceProvider}
              onChange={handleChange}
              placeholder="e.g., Auto Service Center, Dealer"
              style={styles.input}
            />
          </div>

          {/* Next Service Date */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Next Service Date</label>
            <input
              type="date"
              name="nextServiceDate"
              value={formData.nextServiceDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        {/* Notes */}
        <div style={styles.formGroupFull}>
          <label style={styles.label}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes about the service..."
            style={styles.textarea}
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Adding Service...' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937'
  },
  subtitle: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  required: {
    color: '#ef4444'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    transition: 'border-color 0.2s ease-in-out',
    outline: 'none'
  },
  select: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    background: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease-in-out',
    outline: 'none'
  },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    transition: 'border-color 0.2s ease-in-out',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '8px'
  },
  submitButton: {
    background: '#f15a24',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s ease-in-out'
  },
  noVehiclesContainer: {
    background: '#f9fafb',
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center'
  },
  noVehiclesCard: {
    maxWidth: '400px',
    margin: '0 auto'
  },
  noVehiclesTitle: {
    margin: '0 0 12px 0',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#374151'
  },
  noVehiclesText: {
    margin: '0 0 8px 0',
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.5'
  },
  noVehiclesHint: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#9ca3af',
    fontStyle: 'italic'
  }
};

export default ServiceForm;
