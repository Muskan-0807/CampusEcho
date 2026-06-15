import { useState } from "react";
import axios from "axios";
import { BASE_URL3 } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const NewIssue = () => {
  const navigate = useNavigate();
  

  const [category, setCategory] = useState("Academics");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        BASE_URL3 + "/",
        { title, description, category },
        { withCredentials: true }
      );
      navigate("/myissues");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-1">Post New Complaint</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your identity will remain anonymous in the public feed
        </p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option>Academics</option>
              <option>Hostel</option>
              <option>Mess</option>
              <option>Infrastructure</option>
              <option>Library</option>
              <option>Security</option>
              <option>IT/Network</option>
              <option>Other</option>
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Title *</label>
            <input
              type="text"
              placeholder="Brief title for your complaint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Description *</label>
            <textarea
              rows="5"
              placeholder="Describe your complaint in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-3 py-2 resize-none"
            />
          </div>

          
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-900 text-white rounded cursor-pointer"
            >
              Post Issue
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-300 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIssue;
