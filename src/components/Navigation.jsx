import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div style={styles.navContainer}>
      <div style={styles.nav}>
        <h3 style={styles.title}>Vehicle Management System</h3>
        <div style={styles.buttons}>
          <button 
            style={styles.navButton} 
            onClick={() => navigate('/add-vehicle')}
          >
            Add Vehicle
          </button>
          <button 
            style={styles.navButton} 
            onClick={() => navigate('/vehicles')}
          >
            View Vehicles
          </button>
          <button 
            style={styles.logoutButton} 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navigation;

const styles = {
  navContainer: {
    background: '#333',
    color: 'white',
    padding: '10px 0',
    marginBottom: '20px',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  title: {
    margin: 0,
    color: '#f15a24',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    padding: '8px 16px',
    background: '#f15a24',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  logoutButton: {
    padding: '8px 16px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
