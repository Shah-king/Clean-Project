// components/PageLoader.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

 useEffect(() => {
    if (location.pathname === "/feed") {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500); // Adjust as needed for visual consistency

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex justify-center items-center">
      <div
        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default PageLoader;
