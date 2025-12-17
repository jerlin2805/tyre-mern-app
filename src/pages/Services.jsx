import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navigation from "../components/Navigation";
import ServiceForm from "../components/ServiceForm";
import ServiceCard from "../components/ServiceCard";

function Services() {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [selectedVehicleId]);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data || []);
      
      // Auto-select first vehicle if none selected
      if (!selectedVehicleId && response.data && response.data.length > 0) {
        setSelectedVehicleId(response.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      let response;
      if (selectedVehicleId) {
        response = await api.get(`/services/vehicle/${selectedVehicleId}`);
      } else {
        response = await api.get("/services");
      }
      setServices(response.data || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
    }
  };

  const handleVehicleChange = (e) => {
    setSelectedVehicleId(e.target.value);
  };

  const handleServiceAdded = (newService) => {
    setServices(prev => [newService, ...prev]);
    setShowAddForm(false);
  };

  const handleServiceUpdated = (serviceId, updatedService) => {
    setServices(prev => 
      prev.map(service => 
        service._id === serviceId ? updatedService : service
      )
    );
  };

  const handleServiceDeleted = (serviceId) => {
    setServices(prev => prev.filter(service => service._id !== serviceId));
  };

  const formatVehicleInfo = (vehicle) => {
    if (!vehicle) return "";
    return `${vehicle.vehicleNumber} - ${vehicle.brand} (${vehicle.vehicleType})`;
  };

  const getSelectedVehicle = () => {
    return vehicles.find(v => v._id === selectedVehicleId);
  };

  const getServiceStats = () => {
    const totalServices = services.length;
    const totalCost = services.reduce((sum, service) => sum + (service.serviceCost || 0), 0);
    const recentServices = services.filter(service => {
      const serviceDate = new Date(service.serviceDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return serviceDate >= thirtyDaysAgo;
    }).length;

    return { totalServices, totalCost, recentServices };
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading services...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Vehicle Services</h1>
          <p style={styles.subtitle}>
            Track maintenance and service history for your vehicles
          </p>
        </div>

        {/* Vehicle Selection and Controls */}
        <div style={styles.controlsSection}>
          <div style={styles.vehicleSelector}>
            <label style={styles.selectorLabel}>Select Vehicle:</label>
            <select
              value={selectedVehicleId}
              onChange={handleVehicleChange}
              style={styles.vehicleSelect}
            >
              <option value="">All Vehicles</option>
              {vehicles.map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>
                  {formatVehicleInfo(vehicle)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.actionButtons}>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={styles.addButton}
            >
              {showAddForm ? 'Cancel' : 'Add New Service'}
            </button>
          </div>
        </div>

        {/* Statistics */}
        {services.length > 0 && (
          <div style={styles.statsSection}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{getServiceStats().totalServices}</div>
              <div style={styles.statLabel}>Total Services</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>${getServiceStats().totalCost.toFixed(2)}</div>
              <div style={styles.statLabel}>Total Cost</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{getServiceStats().recentServices}</div>
              <div style={styles.statLabel}>Recent (30 days)</div>
            </div>
          </div>
        )}

        {/* Add Service Form */}
        {showAddForm && (
          <div style={styles.formSection}>
            <ServiceForm 
              vehicles={vehicles} 
              onServiceAdded={handleServiceAdded}
            />
          </div>
        )}

        {/* Services Display */}
        <div style={styles.servicesSection}>
          {services.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>🔧</div>
              <h3 style={styles.emptyStateTitle}>
                {selectedVehicleId ? 'No Services Found' : 'No Services Yet'}
              </h3>
              <p style={styles.emptyStateText}>
                {selectedVehicleId 
                  ? `No service records found for ${formatVehicleInfo(getSelectedVehicle())}.`
                  : 'Start tracking your vehicle maintenance and services.'
                }
              </p>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  style={styles.emptyStateButton}
                >
                  Add Your First Service
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={styles.servicesHeader}>
                <h2 style={styles.servicesTitle}>
                  {selectedVehicleId 
                    ? `Services for ${formatVehicleInfo(getSelectedVehicle())}`
                    : 'All Services'
                  }
                </h2>
                <span style={styles.servicesCount}>
                  {services.length} service{services.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div style={styles.servicesGrid}>
                {services.map(service => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    onUpdate={handleServiceUpdated}
                    onDelete={handleServiceDeleted}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6b7280',
    margin: 0
  },
  controlsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '16px'
  },
  vehicleSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: '250px'
  },
  selectorLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    whiteSpace: 'nowrap'
  },
  vehicleSelect: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    background: 'white',
    cursor: 'pointer',
    minWidth: '300px'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px'
  },
  addButton: {
    background: '#f15a24',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#f15a24',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  formSection: {
    marginBottom: '32px'
  },
  servicesSection: {
    minHeight: '400px'
  },
  servicesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  servicesTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  servicesCount: {
    fontSize: '0.875rem',
    color: '#6b7280',
    background: '#f3f4f6',
    padding: '4px 12px',
    borderRadius: '20px'
  },
  servicesGrid: {
    display: 'grid',
    gap: '20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 32px',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: '16px'
  },
  emptyStateTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 12px 0'
  },
  emptyStateText: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0 0 24px 0',
    lineHeight: '1.6'
  },
  emptyStateButton: {
    background: '#f15a24',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #f15a24',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  loadingText: {
    fontSize: '1rem',
    color: '#6b7280'
  }
};

export default Services;
