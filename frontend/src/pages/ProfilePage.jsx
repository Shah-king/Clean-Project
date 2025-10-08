import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { fetchUserById } from "../utils/FetchUserData";
import { acceptReport, completeReport } from "../utils/ReportActions";
import { BACKEND_URL } from "../constants"; // url to hosted backend APi service
import getFirebaseUser from "../utils/GetFirebaseUser"; 
import avatar_image from '../assets/avatar.svg';
import "../styles/ProfilePage.css";


const ProfilePage = () => {
    const { id: userIdParam } = useParams(); // user id extracted from url
    const [userData, setUserData] = useState(null); // user's data fetched from backend api
    const {firebaseUser, authLoading} = getFirebaseUser(); // Firebase user instance
    const [currentUserData, setCurrentUserData] = useState(null); // current authed user data
    const [reports, setReports] = useState([]); // list of reports fetched from backend api
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // tracking current page for pagination component
    
    // pagination
    const reportsPerPage = 3; // number of reports per page
    const totalPages = Math.ceil(reports.length / reportsPerPage); //  counting total number of pages
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    // extracting the reports to display on current page by slicing
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    // functions 

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };
    
    // function to fetch user's data from backend via helper function by user id
    const fetchUserData = async (uid) => {
        try {
          const data = await fetchUserById(uid);
          setUserData({ ...data, uid: uid});
        } catch (err) {
            setError("Could not load user data.");
        }
    };
    // fetch current authorized user data
    const fetchCurrentUserData = async () => {
      if (!firebaseUser?.uid) return;
      try {
        const data = await fetchUserById(firebaseUser.uid);
        setCurrentUserData({ ...data, uid: firebaseUser.uid });
        } catch (err) {
          console.error("Failed to fetch current user data");
        }
    };

    // function to fetch reports created or accepted by specific user from backend API
    const fetchReports = async (uid) => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/reports/user/${uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Could not load user data.");
      } finally {
        setLoading(false);
      }
    };
 

    useEffect(() => {
      if (authLoading) return;
      const uid = userIdParam || firebaseUser?.uid;
      if (!uid) return;
      fetchUserData(uid);
      }, [firebaseUser?.uid, userIdParam, authLoading]);
    
      useEffect(() => {
        if (authLoading) return;
        fetchCurrentUserData();
      }, [firebaseUser?.uid, authLoading]);
      
      useEffect(() => {
        if (authLoading) return;
        const uid = userIdParam || firebaseUser?.uid;
        if (!uid) return;
        fetchReports(uid); 
      }, [firebaseUser?.uid, userIdParam, authLoading]);      

      useEffect(() => {
        // When navigating to a new profile, reset reports and pagination
        setReports([]);
        setCurrentPage(1);
      }, [userIdParam]);

      
    return (
        <div className="p-4 max-w-3xl mx-auto"> 
            
              {error && <p className="text-red-500">{error}</p>}
              {userData && (
                <>
                   {/* Profile Header */}
                <div className="profile-header" style={{ textAlign: "center", marginBottom: 40 }}>
                <img
                  className="profile-pic"
                  src={avatar_image}
                  alt="Profile"
                  style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
                />
                <h2 className="profile-name" style={{ marginTop: 12 }}>
                  {userData.name}
                </h2>
                <p className="profile-email" style={{ color: "#555", marginBottom: 6 }}>
                  {userData.email}
                </p>
                <div className="profile-role" style={{ fontWeight: "bold", color: "#333" }}>
                  {userData.role}
                </div>
              </div>
                </>
              )}
                
                {/* Reports Section */}
                <h1 className="title" style={{ marginBottom: 20 }}>
                  Reports
                </h1>
                  {loading && (
                <div className="flex justify-center items-center h-20">
                  <div
                    className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                    role="status"
                    aria-label="Loading"
                  />
                </div>
              )}

              {currentReports.map((report) => (
        <section className="feed-container mt-10" key={report._id}>
          <div className="feed-img image-frame">
            <img src={report.image || "/placeholder.png"} alt={report.title} />
          </div>

          <div className="feed-content">
            <div className="feed-header">
              <div className="title-location-row">
                <h2 className="title2">{report.title}</h2>
              </div>
              <div
                className={`status ${
                  report.status === "completed"
                    ? "bg-green"
                    : report.status === "in progress"
                    ? "bg-yellow"
                    : "bg-gray"
                }`}
              >
                {report.status}
              </div>
            </div>

            <p className="description line-clamp-2">
              <span className="text-black-800 font-semibold">Location:</span>{" "}
              {report.location}
            </p>
            <p className="description line-clamp-2">
              <span className="text-black-800 font-semibold">Description:</span>{" "}
              {report.description}
            </p>

            <div className="feed-author-info">
              <p>
                <strong>Author:</strong>{" "}
                
                <Link to={`/profile/${report.creator_id}`}>
                  {report.author_name}
                </Link>
              </p>
              {report.handler_name && (
                <p>
                  <strong>Taken By:</strong>{" "}
                  <Link to={`/profile/${report.handler_id}`}>
                    {report.handler_name}
                  </Link>
                </p>
              )}
            </div>

            <div className="feed-footer">
              <p className="feed-post-time">
                <strong>Created:</strong>{" "}
                {new Date(report.createdAt).toLocaleString()}
              </p>

              <div className="buttons">
                <Link to={`/reports/${report._id}`}>
                  <button className="detail">Details</button>
                </Link>

                {currentUserData?.role === "staff" && !report.handler_id && report.creator_id !== firebaseUser.uid &&  (
                  <button
                    className="accept-task"
                    onClick={() =>acceptReport(report._id, currentUserData, () => fetchReports(userIdParam || firebaseUser.uid))}
                  >
                    Accept Task
                  </button>
                )}

                {currentUserData?.role === "staff" &&
                  report.handler_id === firebaseUser.uid &&
                  report.status === "in progress" && (
                    <button
                      className="complete-task"
                      onClick={() =>completeReport(report._id, () => fetchReports(userIdParam || firebaseUser.uid))}

                    >
                      Complete
                    </button>
                  )}
              </div>
            </div>
          </div>
        </section>
      ))}
           {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"
          >
            ← Prev
          </button>

          {/* Page numbers (max 5 visible) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((pageNum) => {
              // Always show first & last
              if (pageNum === 1 || pageNum === totalPages) return true;
              // Show pages around current (2 before & 2 after)
              return pageNum >= currentPage - 2 && pageNum <= currentPage + 2;
            })
            .map((num, index, arr) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-4 py-2 rounded border ${
                  currentPage === num
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
         )}
            </div>
    )
}

export default ProfilePage;