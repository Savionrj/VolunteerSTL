import { useState, useEffect } from 'react'
import Header from './components/Header'
import EffortsDashboard from './components/EffortsDashboard'
import EffortPage from './components/EffortPage'
import LoginSignUpPage from './components/LoginSignUpPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [efforts, setEfforts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const fetchEfforts = async () => {
    try {
      const response = await fetch('http://localhost:8080/efforts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEfforts(data);
    } catch (err) {
      console.error('Failed to fetch efforts:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEfforts();
  }, []);

  return (
    <>
      {!user ?
        <LoginSignUpPage setUser={setUser} /> :
        (
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<EffortsDashboard efforts={efforts} />} />
              <Route path="/effort/:effortId" element={<EffortPage efforts={efforts} />} />
            </Routes>
          </Router>
        )}
    </>
  )
}

export default App
