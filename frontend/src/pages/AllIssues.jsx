import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL3 } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import IssueCard from "../components/IssueCard";

const AllIssues = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get(BASE_URL3 + "/", {
          withCredentials: true,
        });
        setIssues(res.data.issues);
      } catch (err) {
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const categoryMatch =
      category === "All" || issue.category === category;
    const statusMatch =
      status === "All" || issue.status === status;

    return categoryMatch && statusMatch;
  });
  if(loading){
    return <h1 className="flex items-center justify-center text-xl font-bold min-h-screen"> Loading Issues....</h1>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
  
      <div className="flex justify-between items-center bg-white rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Complaint Feed
        </h1>
        <button
          onClick={() => navigate("/newissue")}
          className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded"
        >
          + Post Complaint
        </button>
      </div>

      
      <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option>All</option>
            <option>Academics</option>
            <option>Hostel</option>
            <option>Transport</option>
            <option>Mess</option>
            <option>Infrastructure</option>
            <option>Library</option>
            <option>Security</option>
            <option>IT/Network</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-600">
          Showing {filteredIssues.length} of {issues.length} complaints
        </div>
      </div>

    
      {loading && <p>Loading complaints...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && filteredIssues.length === 0 && (
        <div className="bg-white rounded-lg p-6 text-center text-gray-600">
          No complaints found
        </div>
      )}

    
      {filteredIssues.map((issue)=>(<IssueCard key={issue._id} issue={issue}/>))}
    </div>
  );
};

export default AllIssues;