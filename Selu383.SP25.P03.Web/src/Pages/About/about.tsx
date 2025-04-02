import React from 'react';
import Navbar from '../../components/Navbar';

const styles = `
  :root {
    --primary-color: #000000;
    --accent-color: #ff0000;
    --text-light: #ffffff;
    --text-dark: #121212;
  }

  body {
    color: var(--text-light);
    background-color: var(--primary-color);
    margin: 0;
    padding: 0;
  }

  header {
    background-color: #121212;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .about-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1rem;
    animation: fadeIn 0.5s ease-out forwards;
  }

  .section-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--accent-color);
  }

  .section-paragraph {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: #ccc;
  }

  .contact-box {
    background-color: #1e1e1e;
    border-left: 4px solid var(--accent-color);
    padding: 1rem;
    border-radius: 6px;
    color: #eee;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
    .cinema-logo {
    color: var(--accent-color);
    font-size: 1.5rem;
    font-weight: bold;
  }

  .nav-links {
    display: flex;
    gap: 24px;
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      text-align: center;
    }

    .nav-links {
      margin-top: 1rem;
    }
  }
`;

const About: React.FC = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="about-container">
          <h1 className="section-title">About Lion's Den Cinema</h1>
          <p className="section-paragraph">
            Lion's Den Cinema was established in 2025 with one mission in mind — to bring movie lovers the best cinematic experience in the region.
            Whether you're here for a blockbuster, a local indie premiere, or just a good bucket of popcorn, we’ve got something for everyone.
          </p>

          <p className="section-paragraph">
            Our theaters are equipped with the latest in audio and visual technology to immerse you in the world of film like never before. We
            also offer online seat selection, reserved seating, and an app to order food right to your seat.
          </p>

          <h2 className="section-title">Contact Us</h2>
          <div className="contact-box">
            <p><strong>Southeastern Louisiana University</strong></p>
            <p>500 W University Ave</p>
            <p>Hammond, LA 70402</p>
            <p>Phone: (985) 549-2000</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
