import { useDispatch, useSelector } from "react-redux";
import { GetUser } from "../utils/authSlice";
import { useEffect, useState } from "react";
import { BASE_URL2, BASE_URL3 } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate= useNavigate();

  const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try{
    const res = await axios.get(BASE_URL2 + "/me", { withCredentials: true });

    dispatch(GetUser(res.data.user));
    }catch(err){
      console.log(err);
    }
  };
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    getUser();
  }, []);

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

  const total = issues.length;

const pending = issues.filter(
  (issue) => issue.status === "Pending"
).length;

const inProgress = issues.filter(
  (issue) => issue.status === "In Progress"
).length;

const resolved = issues.filter(
  (issue) => issue.status === "Resolved"
).length;

  if(loading){
    return <h1 className="flex items-center justify-center text-xl font-bold min-h-screen"> Loading Dashboard....</h1>;
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
      <div className="text-center ">
        <h1 className="text-3xl font-bold mt-7 mb-4">
          Welcome, {user?.firstName + "!"}
        </h1>
        {user && (
          <p className="text-sm text-gray-600 mt-1">
            {user?.regNumber} | {user?.department} | {("year- "+user?.year)
            }
          </p>
        )}
      </div>
        
      

      <div className="flex flex-col md:flex-row gap-4">
        <StatCard title="Total" value={total} subtitle="Total Complaints" />
        <StatCard title="Pending" value={pending} subtitle="Pending" />
        <StatCard title="In Progress" value={inProgress} subtitle="In Progress" />
        <StatCard title="Resolved" value={resolved} subtitle="Resolved" />
      </div>


      <div className="bg-white rounded-lg p-4">
        <h2 className="font-semibold mb-3 text-gray-800 text-2xl">
          Quick Actions
        </h2>

        <div className="flex gap-4 text-white text-center">
          <ActionButton text="+" subtitle="Post New Issue" onClick={() => navigate("/newissue")} />
          <ActionButton text="List" subtitle="View All Issues" onClick={()=> navigate("/allissues")} />
          <ActionButton text="My" subtitle="My Issues" onClick={()=> navigate("/myissues")} />
        </div>
      </div>

     {!loading && issues.length ===0 && (
      <div className="bg-white rounded-lg p-10 text-center">
        <h2 className="text-5xl mb-6">Empty</h2>
        <p className="text-gray-800 mt-3 font-bold text-xl mb-4">
          No issues yet
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Start by posting your first issue
        </p>

        <button className="px-7 py-3 bg-indigo-900 text-white rounded mb-18 cursor-pointer hover:bg-indigo-800 hover:shadow-xl" 
         onClick={() => navigate("/newissue")}>
          Post Issue
        </button>
      </div>
     )} 
     
     {issues.length > 0 && (
  <div className="bg-white rounded-lg p-6 mt-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">
      Recent Complaints
    </h2>

    <div className="flex flex-col gap-3">
      {issues.slice(0,3).map((issue) => (
        <div
          key={issue._id}
          className="flex justify-between items-center border-b border-gray-800 pb-3"
        >
          {/* Left side */}
          <div>
            <p className="font-medium text-gray-900">
              {issue.title}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Right side */}
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium
              ${
                issue.status === "Pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : issue.status === "In Progress"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-green-200 text-green-800"
              }
            `}
          >
            {issue.status.toUpperCase()}
          </span>
        </div>
      ))}
    </div>

    {/* View All Button */}
    <div className="mt-4">
      <button
        onClick={() => navigate("/myissues")}
        className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer"
      >
        View All My Complaints
      </button>
    </div>
  </div>
)}
    </div>
  );
};

function StatCard({ title, value, subtitle }) {
  return (
    <div className="flex-1 bg-white rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-xl">
      <h3 className=" text-gray-800 font-semibold text-2xl">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-black">{subtitle}</p>
    </div>
  );
}

function ActionButton({ text, subtitle ,onClick}) {
  return (
    
    
    <div onClick={onClick} className="flex-1 bg-indigo-900 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <p className="text-3xl font-semibold mb-4">{text}</p>
      <p className="text-lg">{subtitle}</p>
    </div>
  );
}
export default Dashboard;
