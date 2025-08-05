import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import EffortsDashboard from './components/EffortsDashboard'
import EffortPage from './components/EffortPage'
import LoginSignUpPage from './components/LoginSignUpPage'
import AccountPage from './components/AccountPage'
import AddEffort from './components/AddEffort'
import Settings from './components/Settings';
import Notifications from './components/Notifications';
import Messages from './components/Messages';

function App() {
  const [allEfforts, setEfforts] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [hasNotifications, setHasNotifications] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);


  useEffect(() => {
    if (!user) return;
    const refreshUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${user.id}`)
        if (response.ok) {
          const userDTO = await response.json();
          setUser(userDTO);
        } else if (response.status === 401) {
          console.error("Invalid password.");
        } else if (response.status === 404) {
          console.error("User not found.");
        } else {
          console.error("Login failed");
        }
      } catch (error) {
        console.error("Error signing user in:", error);
      }
    }
    refreshUser();
  }, [])

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
    if (!user) return;
    fetchEfforts();
  }, []);

  const getPendingConnections = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:8080/connections/by-receiver-pending?receiverId=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPendingConnections(data);
    } catch (err) {
      console.error('Failed to fetch pending connections:', err.message);
      setError(err.message);
    }
  }

  useEffect(() => {
    getPendingConnections();
  }, [user]);

  useEffect(() => {
    setHasNotifications(!!pendingConnections.length);
  }, [pendingConnections]);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      try {
        const res = await fetch(`http://localhost:8080/messages/conversations?userId=${user.id}`);
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err.message);
      }
    };

    fetchConversations();
  }, [user]);
  return (
    <>
      <Router>
        {!user ?
          (<LoginSignUpPage setUser={setUser} />) : (<><Header user={user} hasNotifications={hasNotifications} setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
            <Routes>
              <Route path="/" element={<EffortsDashboard allEfforts={allEfforts} user={user} sidebarOpen={sidebarOpen} conversations={conversations} setSidebarOpen={setSidebarOpen} />} />
              <Route path="/effort/:effortId" element={<EffortPage efforts={allEfforts} user={user} />} />
              <Route path="/account/:userId" element={<AccountPage user={user} />} />
              <Route path="/add-effort" element={<AddEffort user={user} fetchEfforts={fetchEfforts} />} />
              <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
              <Route path="/notifications" element={<Notifications user={user} pendingConnections={pendingConnections} getPendingConnections={getPendingConnections} />} />
              <Route path="/message" element={<Messages user={user} />} />
            </Routes></>)}
      </Router>
    </>
  )
}

export default App
