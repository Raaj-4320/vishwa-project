import { Link } from 'react-router-dom';

export const LandingPage = () => (
  <section className="hero">
    <h1>Location-Based Smart Medical Shop Platform</h1>
    <p>Find serviceable pharmacies by city, area, locality and pincode. No maps. Fast and compliant.</p>
    <div className="actions">
      <Link to="/discover" className="btn">Discover Stores</Link>
      <Link to="/login" className="btn btn-secondary">Login</Link>
    </div>
  </section>
);
