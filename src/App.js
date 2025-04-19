// App.js - Main Application Component with Footer
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AllDeadlines from './pages/AllDeadlines';
import Home from './pages/Home';
import './styles/main.css';

function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    }
  }, [userEmail]);

  return (
    <Router>
      <div className="app">
        <Navbar userEmail={userEmail} setUserEmail={setUserEmail} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home userEmail={userEmail} setUserEmail={setUserEmail} />} />
            <Route path="/deadlines" element={<AllDeadlines userEmail={userEmail} setUserEmail={setUserEmail} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;