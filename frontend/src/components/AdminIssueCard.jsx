import { useState } from "react";
import axios from "axios";
import { BASE_URL3 } from "../utils/constants";

const AdminIssueCard = ({ issue, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(issue.status);
  const [response, setResponse] = useState(issue.adminResponse || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.patch(`${BASE_URL3}/${issue._id}/status`, {
        status,
        adminResponse: response,
        
      },{
        withCredentials:true,
      });

      setIsEditing(false);
      onRefresh(); // refetch issues
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this issue?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(`${BASE_URL3}/${issue._id}`,
      {
        withCredentials:true,
      });
    
    onRefresh(); // refetch issues
  } catch (error) {
    alert("Failed to delete issue");
  }
};

  return (
    <div className="bg-white rounded-lg border p-5">

      {/* TOP ROW */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 bg-gray-200 rounded">
            {issue.category}
          </span>

          <span className="text-xs px-2 py-1 bg-yellow-300 rounded">
            {issue.status}
          </span>
        </div>

        <span className="text-xs text-gray-500">
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* TITLE */}
      <h2 className="text-lg font-semibold mt-2">
        {issue.title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-700 mt-1">
        {issue.description}
      </p>

      {/* CURRENT RESPONSE (only if exists & not editing) */}
      {!isEditing && issue.adminResponse && (
        <div className="mt-3 bg-green-100 border-l-4 border-green-600 p-3">
          <p className="text-sm font-medium text-green-800">
            Current Response:
          </p>
          <p className="text-sm text-green-700">
            {issue.adminResponse}
          </p>
        </div>
      )}

      {/* COUNTS */}
      <div className="text-sm text-gray-600 mt-3">
        Agrees: {issue.agreeCount} &nbsp;
        Disagrees: {issue.disagreeCount} &nbsp;
        Comments: {issue.comments.length}
      </div>

      {/* ACTIONS */}
      {!isEditing && (
        <div className="flex gap-2 mt-4">
        <button
  disabled={issue.status === "Resolved"}
  onClick={() => setIsEditing(true)}
  className={`px-3 py-1 rounded text-white
    ${
      issue.status === "Resolved"
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
>
  Update Status
</button>

          <button className="px-4 py-1 bg-red-600 text-white rounded"
          onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      {/* EDIT SECTION (INLINE) */}
      {isEditing && (
        <div className="mt-4 border rounded p-4 bg-gray-50">

          <label className="text-sm font-medium">
            Update Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1 mb-3"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <label className="text-sm font-medium">
            Management Response
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Enter your response to the student..."
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminIssueCard;