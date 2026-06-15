import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL3 } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const MyIssues = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const res = await axios.get(BASE_URL3 + "/my", {
          withCredentials: true,
        });
        setIssues(res.data.issues);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load your complaints"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyIssues();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-5 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          My Complaints
        </h1>
        <button
          onClick={() => navigate("/newissue")}
          className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer"
        >
          + Post New Complaint
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-white">Loading your complaints...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-300 font-medium">{error}</p>
      )}

      {/* No Issues */}
      {!loading && issues.length === 0 && (
        <div className="bg-white rounded-lg p-10 text-center">
          <h2 className="text-4xl mb-4">Empty</h2>
          <p className="text-gray-700 font-semibold mb-2">
            No complaints yet
          </p>
          <p className="text-gray-500 mb-6">
            Start by posting your first complaint
          </p>
          <button
            onClick={() => navigate("/newissue")}
            className="px-6 py-2 bg-indigo-600 text-white rounded cursor-pointer"
          >
            Post Complaint
          </button>
        </div>
      )}

      {/* Issues List */}
      <div className="flex flex-col gap-4">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white rounded-lg p-5 flex justify-between"
          >
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                  {issue.category.toUpperCase()}
                </span>
                <span className="px-2 py-1 text-xs bg-yellow-300 rounded">
                  {issue.status.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {issue.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-2">
                {issue.description}
              </p>

              {/* Stats */}
              <p className="text-xs text-gray-500">
                Agrees: {issue.agrees?.length || 0} | Disagrees:{" "}
                {issue.disagrees?.length || 0} | Comments:{" "}
                {issue.comments?.length || 0}
              </p>
            </div>

            {/* Date */}
            <div className="text-sm text-gray-500">
              {new Date(issue.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyIssues;