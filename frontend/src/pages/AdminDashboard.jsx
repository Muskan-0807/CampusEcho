
import { useEffect, useState } from "react";
import axios from "axios";
import AdminIssueCard from "../components/AdminIssueCard";
import { BASE_URL3 } from "../utils/constants";
const AdminDashboard = () => {
    const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

   const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
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
useEffect(() => {
    fetchIssues();
  }, []);
  const totalCount = issues.length;

const pendingCount = issues.filter(
  (issue) => issue.status === "Pending"
).length;

const inProgressCount = issues.filter(
  (issue) => issue.status === "In Progress"
).length;

const resolvedCount = issues.filter(
  (issue) => issue.status === "Resolved"
).length;

  const filteredIssues = issues.filter((issue) => {
    const categoryMatch =
      category === "All" || issue.category === category;
    const statusMatch =
      status === "All" || issue.status === status;

    return categoryMatch && statusMatch;
  });
  if(loading){
    return <h1 className="flex items-center justify-center text-xl font-bold min-h-screen"> Loading ....</h1>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">

      
      <div className="bg-white rounded-lg p-4">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          Manage Issues
        </h1>
        <p className="text-sm text-gray-600">
          View and manage all student issues
        </p>
      </div>


      <div className="flex flex-col md:flex-row gap-4">
        <StatCard title="TOTAL" value={totalCount} />
        <StatCard title="PENDING" value={pendingCount} />
        <StatCard title="IN PROGRESS" value={inProgressCount} />
        <StatCard title="RESOLVED" value={resolvedCount} />
      </div>

    
      {/* Filters */}
      <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="flex flex-col ">
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

      {/* 4. COMPLAINT LIST */}
    <div className="p-6 space-y-4">
      {filteredIssues.map(issue => (
        <AdminIssueCard key={issue._id} issue={issue} onRefresh={fetchIssues}/>
      ))}
    </div>

    </div>
  );
};


function StatCard({ title, value }) {
  return (
    <div className="flex-1 bg-white rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-xl text-center hover:-translate-y-1">
                    <p className="text-2xl font-bold mb-3">{value}</p>
      <h3 className="text-indigo-900 font-semibold">{title}</h3>
      
    </div>
  );
}


export default AdminDashboard;