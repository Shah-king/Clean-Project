import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../constants"; // url to hosted backend APi service
import { fetchUserById } from "../utils/FetchUserData";
import { acceptReport, completeReport } from "../utils/ReportActions";
import getFirebaseUser from "../utils/GetFirebaseUser"; 

const ReportDetails = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null);
    const {firebaseUser, authLoading} = getFirebaseUser(); // Firebase user instance

    // Define fetchReport separately so it can be reused
    const fetchReport = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/report/${id}`);
        if (!res.ok) throw new Error("Failed to fetch report.");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };



     const fetchUserData = async () => {
            try {
              const data = await fetchUserById(firebaseUser.uid);
              setUserData({ ...data, uid: firebaseUser.uid});
            } catch (err) {
                setError("Could not load user data.");
            }
        };


      useEffect(() => {
        if (authLoading) return;
        fetchUserData();
      }, [firebaseUser?.uid, authLoading]);
      
      // Run fetchReport inside useEffect
      useEffect(() => {
        fetchReport();
      }, [id]);

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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      {/* Title and author */}
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">{report.title}</h1>
        <div className="text-right space-y-1">
          <p className="text-green-600 font-semibold">Author: {report.author_name}</p>
          {report.handler_id && (
            <p className="text-blue-600 font-medium">Taken by: {report.handler_name}</p>
          )}
        </div>
      </div>

      {/* Image */}
      {report.image && (
        <img
          src={report.image}
          alt={report.title}
          className="w-full max-h-96 object-cover rounded"
        />
      )}

      {/* Info block */}
      <div>
        <p className="text-gray-700">
          <strong>Location:</strong> {report.location}
        </p>
        <p className="text-gray-700">
          <strong>Description:</strong> {report.description}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              report.status === "completed"
                ? "text-green-700"
                : report.status === "in progress"
                ? "text-yellow-600"
                : "text-gray-600"
            }`}
          >
            {report.status}
          </span>
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Created:</strong> {new Date(report.createdAt).toLocaleString()}
        </p>
      </div>
            <div className="buttons">
                {userData?.role === "staff" && !report.handler_id && report.creator_id != userData.uid &&  (
                  <button className="accept-task"
                    onClick={() => acceptReport(report._id, userData, fetchReport)}
                  >
                    Accept Task
                  </button>
                )}

                {userData?.role === "staff" &&
                  report.handler_id === userData.uid &&
                  report.status === "in progress" && (
                    <button
                      className="complete-task"
                      onClick={() => completeReport(report._id, fetchReport)}
                    >
                      Complete
                    </button>
                  )}
              </div>
      
    </div>
    
  );  
}

export default ReportDetails;