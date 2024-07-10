import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.navbrand}>Your Website</div>
        <div style={styles.navlinks}>
          <Link to="/login" style={styles.navlink}>Login</Link>
          <Link to="/SignUp" style={styles.navlink}>Sign Up</Link>
        </div>
      </nav>
      <div style={styles.content}>
        <h1>Welcome to Your Website!</h1>
        <p>This is the home page content.</p>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  navbrand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navlinks: {
    display: 'flex',
  },
  navlink: {
    margin: '0 10px',
    color: '#fff',
    textDecoration: 'none',
  },
  content: {
    padding: '20px',
    textAlign: 'center',
  },
};

export default Home;
