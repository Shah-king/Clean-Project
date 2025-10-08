import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Button from "./ui/Button";
import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsModalOpen(false);
      navigate("/");
    });
  };

  return (
    <div>
      <nav className="w-full h-[100px] bg-[#e3f9ff] flex items-center justify-between px-[20px] md:px-[35px] relative">

        {/* Logo */}
        <div className="w-[100px] h-10 flex items-center justify-center 
                sm:w-[120px] 
                xs:w-[10px]">
  <img src={logo} alt="logo" />
</div>

<button
  onClick={() => setIsOpen(!isOpen)}
  className="md:hidden flex flex-col justify-center items-center w-10 h-10"
>
  <span className="block w-6 h-0.5 bg-black mb-1"></span>
  <span className="block w-6 h-0.5 bg-black mb-1"></span>
  <span className="block w-6 h-0.5 bg-black"></span>
</button>
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="font-medium text-black text-lg hover:text-gray-600">Home</Link>
          <Link to="/feed" className="font-medium text-black text-lg hover:text-gray-600">Feed</Link>
          <Link to="/about" className="font-medium text-black text-lg hover:text-gray-600">About</Link>
          <Link to="/contact" className="font-medium text-black text-lg hover:text-gray-600">Contact Us</Link>
          <Link to="/create" className="font-medium text-black text-lg hover:text-gray-600">Report Now</Link>
        </div>

        {/* Right side (Button + Auth logic) */}
       {isAuthenticated ? (
  <>
    {/* Profile Dropdown */}
    <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-24 h-[2rem] bg-[#d9d9d9] rounded-full text-black text-sm hover:bg-gray-300"
            >
              Profile
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md z-50">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
  </>
) : (
  <Link to="/login">
    <Button className="w-20 h-[2rem] bg-[#d9d9d9] rounded-full text-black text-sm hover:bg-gray-300">
      Login
    </Button>
  </Link>
)}


         

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute top-[100px] left-0 w-full bg-[#e3f9ff] flex flex-col items-center gap-4 py-4 md:hidden z-10 shadow-md">
            <Link to="/" className="font-medium text-black text-lg hover:text-gray-600" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/feed" className="font-medium text-black text-lg hover:text-gray-600" onClick={() => setIsOpen(false)}>Feed</Link>
            <Link to="/about" className="font-medium text-black text-lg hover:text-gray-600" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" className="font-medium text-black text-lg hover:text-gray-600" onClick={() => setIsOpen(false)}>Contact Us</Link>
            <Link to="/create" className="font-medium text-black text-lg hover:text-gray-600" onClick={() => setIsOpen(false)}>Report now</Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="font-medium text-black text-lg hover:text-gray-600"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to log out?
            </h2>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Log Out
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-2 w-full text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
