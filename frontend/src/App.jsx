import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
import Navbar from './components/Navbar.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import ReportDetails from './pages/ReportDetails.jsx'
import Footer from './components/Footer.jsx';
import PageLoader from './utils/PageLoader.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  if (loading) return (
        <div className="flex justify-center items-center h-20">
          <div
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
        </div>
      );

  return (
    <Router>
      <Navbar/>
     
      <Routes>
        {/* Public Home Page */}
        <Route path="/" element={<HomePage onLogout={handleLogout} />} />
          
        {/* Public Feed Page */}
        
        <Route path="/feed" element={  <FeedPage/>} />
        
        {/*Public Profile Page*/}
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/*Public About Page*/}
        <Route path="/about" element={<AboutPage />} />

        {/*Public Contact Page*/}
        <Route path="/contact" element={<ContactPage />} />


        {/* Protected Profile Page */}
        <Route path="/profile" element={user ? <Navigate to={`/profile/${user.uid}`} /> : <Navigate to="/login" />}/>

        {/* Protected Report Page */}
        <Route
          path="/create"
          element={user ? <ReportPage /> : <Navigate to="/login" />}
        />
         {/* Public Report details page */}
        <Route path="/reports/:id" element={<ReportDetails />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterPage />}
        />

        {/* 404 fallback */}
        <Route path="*" element={<p>404 - Not Found</p>} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
