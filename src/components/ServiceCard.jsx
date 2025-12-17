import { useState } from 'react';
import api from '../services/api';

function ServiceCard({ service, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    serviceDescription: service.serviceDescription,
    serviceDate: service.serviceDate ? new Date(service.serviceDate).toISOString().split('T')[0] : '',
    serviceCost: service.serviceCost || '',
    serviceProvider: service.serviceProvider || '',
    notes: service.notes || '',
    nextServiceDate: service.nextServiceDate ? new Date(service.nextServiceDate).toISOString().split('T')[0] : '',
    serviceType: service.serviceType || 'maintenance'
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      serviceDescription: service.serviceDescription,
      serviceDate: service.serviceDate ? new Date(service.serviceDate).toISOString().split('T')[0] : '',
      serviceCost: service.serviceCost || '',
      serviceProvider: service.serviceProvider || '',
      notes: service.notes || '',
      nextServiceDate: service.nextServiceDate ? new Date(service.nextServiceDate).toISOString().split('T')[0] : '',
      serviceType: service.serviceType || 'maintenance'
    });
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/services/${service._id}`, editData);
      onUpdate(service._id, response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update service:', err);
      alert('Failed to update service. Please try again.');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Delete this service record?');
    if (!confirm) return;

    try {
      await api.delete(`/services/${service._id}`);
      onDelete(service._id);
    } catch (err) {
      console.error('Failed to delete service:', err);
      alert('Failed to delete service. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCost = (cost) => {
    if (!cost) return 'Not specified';
    return `$${cost.toFixed(2)}`;
  };

  const getServiceTypeColor = (type) => {
    const colors = {
      maintenance: '#10b981',
      repair: '#f59e0b', 
      inspection: '#3b82f6',
      replacement: '#8b5cf6',
      other: '#6b7280'
    };
    return colors[type] || colors.other;
  };

  if (isEditing) {
    return (
      <div style={styles.card}>
        <div style={styles.editHeader}>
          <h4 style={styles.cardTitle}>Edit Service</h4>
          <span style={styles.vehicleInfo}>
            {service.vehicle?.vehicleNumber} - {service.vehicle?.brand}
          </span>
        </div>

        <div style={styles.form}>
          <div style={styles.formRow}>
            <label style={styles.label}>Service Description *</label>
            <input
              type="text"
              value={editData.serviceDescription}
              onChange={(e) => setEditData({...editData, serviceDescription: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Service Date *</label>
            <input
              type="date"
              value={editData.serviceDate}
              onChange={(e) => setEditData({...editData, serviceDate: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Service Cost</label>
            <input
              type="number"
              step="0.01"
              value={editData.serviceCost}
              onChange={(e) => setEditData({...editData, serviceCost: parseFloat(e.target.value) || 0})}
              style={styles.input}
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Service Provider</label>
            <input
              type="text"
              value={editData.serviceProvider}
              onChange={(e) => setEditData({...editData, serviceProvider: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Service Type</label>
            <select
              value={editData.serviceType}
              onChange={(e) => setEditData({...editData, serviceType: e.target.value})}
              style={styles.select}
            >
              <option value="maintenance">Maintenance</option>
              <option value="repair">Repair</option>
              <option value="inspection">Inspection</option>
              <option value="replacement">Replacement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Next Service Date</label>
            <input
              type="date"
              value={editData.nextServiceDate}
              onChange={(e) => setEditData({...editData, nextServiceDate: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Notes</label>
            <textarea
              value={editData.notes}
              onChange={(e) => setEditData({...editData, notes: e.target.value})}
              style={styles.textarea}
              rows="3"
            />
          </div>
        </div>

        <div style={styles.btnGroup}>
          <button onClick={handleSave} style={styles.saveBtn}>
            Save
          </button>
          <button onClick={handleCancel} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.titleRow}>
          <h4 style={styles.cardTitle}>{service.serviceDescription}</h4>
          <span 
            style={{
              ...styles.typeBadge,
              backgroundColor: getServiceTypeColor(service.serviceType)
            }}
          >
            {service.serviceType}
          </span>
        </div>
        <span style={styles.vehicleInfo}>
          {service.vehicle?.vehicleNumber} - {service.vehicle?.brand} ({service.vehicle?.vehicleType})
        </span>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Date:</span>
            <span style={styles.infoValue}>{formatDate(service.serviceDate)}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Cost:</span>
            <span style={styles.infoValue}>{formatCost(service.serviceCost)}</span>
          </div>
          {service.serviceProvider && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Provider:</span>
              <span style={styles.infoValue}>{service.serviceProvider}</span>
            </div>
          )}
          {service.nextServiceDate && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Next Service:</span>
              <span style={styles.infoValue}>{formatDate(service.nextServiceDate)}</span>
            </div>
          )}
        </div>

        {service.notes && (
          <div style={styles.notes}>
            <span style={styles.infoLabel}>Notes:</span>
            <p style={styles.notesText}>{service.notes}</p>
          </div>
        )}
      </div>

      <div style={styles.cardFooter}>
        <div style={styles.dateInfo}>
          <small>Added: {new Date(service.createdAt).toLocaleDateString()}</small>
        </div>
        <div style={styles.btnGroup}>
          <button onClick={handleEdit} style={styles.editBtn}>
            Edit
          </button>
          <button onClick={handleDelete} style={styles.deleteBtn}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out'
  },
  cardHeader: {
    marginBottom: '16px'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  vehicleInfo: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  typeBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize'
  },
  cardBody: {
    marginBottom: '16px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  infoLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  infoValue: {
    fontSize: '0.875rem',
    color: '#1f2937',
    fontWeight: '500'
  },
  notes: {
    marginTop: '12px'
  },
  notesText: {
    margin: '4px 0 0 0',
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: '1.5'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6'
  },
  dateInfo: {
    color: '#9ca3af',
    fontSize: '0.75rem'
  },
  btnGroup: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    background: '#f15a24',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  deleteBtn: {
    background: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  editHeader: {
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px'
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    transition: 'border-color 0.2s ease-in-out'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    background: 'white',
    transition: 'border-color 0.2s ease-in-out'
  },
  textarea: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    transition: 'border-color 0.2s ease-in-out',
    resize: 'vertical'
  },
  saveBtn: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  cancelBtn: {
    background: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default ServiceCard;
