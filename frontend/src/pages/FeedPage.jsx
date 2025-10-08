// importing necessary libs and modules
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUserById } from "../utils/FetchUserData";
import { BACKEND_URL } from "../constants"; // url to hosted backend APi service
import { acceptReport, completeReport } from "../utils/ReportActions";
import "../styles/FeedPage.css";
import getFirebaseUser from "../utils/GetFirebaseUser"; 


const FeedPage = () => {
    // variables
    const [reports, setReports] = useState([]); // list of reports
    const [loading, setLoading] = useState(false); // loading state
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null); // user's data fetched from backend API
    const {firebaseUser, authLoading} = getFirebaseUser(); // Firebase user instance
    const [currentPage, setCurrentPage] = useState(1); // tracking current page for pagination component
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

    // function to fetch all reports from backend API
    const fetchReports = async (controller) => {
        try {
            setLoading(true);
            // sending GET request to backend API
            const response = await fetch(`${BACKEND_URL}/reports`, {
                    signal: controller.signal,
            });
            if (response.ok == false) {
                throw new Error("Failed to fetch user data");
            }
            // getting reports from json
            const data = await response.json()
            // storing
            setReports(data);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Could not load user data.");
        }  finally {
            setLoading(false);
        }
    };
    
    
    
    useEffect(() => {
      if (!authLoading && firebaseUser?.uid) {
        fetchUserById(firebaseUser.uid)
            .then((user) => setUserData({ ...user, uid: firebaseUser.uid }))
            .catch((err) => setError(err.message));
        }
      }, [firebaseUser, authLoading]);

    useEffect(() => {
      const controller = new AbortController();
      fetchReports(controller);
      return () => controller.abort();
    }, []);


    return (
    <div className="feed-page">
{loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  ) : (
    <>
      <section>
        <h1 className="title">Campus Reports</h1>
      </section>

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

                {userData?.role === "staff" && !report.handler_id && report.creator_id != userData.uid &&  (
                  <button
                    className="accept-task"
                    onClick={() => acceptReport(report._id, userData, fetchReports)}
                  >
                    Accept Task
                  </button>
                )}

                {userData?.role === "staff" &&
                  report.handler_id === userData.uid &&
                  report.status === "in progress" && (
                    <button
                      className="complete-task"
                      onClick={() => completeReport(report._id, fetchReports)}
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
       </>
      )}
    </div> 
    )
}

export default FeedPage;
