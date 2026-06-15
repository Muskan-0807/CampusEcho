import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL2 } from "../utils/constants";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword) {
      setError("Please fill all fields");
      return;
    }

    try {
      await axios.patch(
        `${BASE_URL2}/change-password`,
        {
          oldPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      setSuccess("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-indigo-100 to-indigo-300">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-6">
          Change Password
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Old Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

    
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        
        {success && (
          <p className="text-green-600 text-sm mb-3 text-center">
            {success}
          </p>
        )}


        <div className="flex gap-4 mt-4">
          <button
            onClick={handleUpdatePassword}
            className="flex-1 bg-indigo-600 text-white py-2 rounded"
          >
            Update Password
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex-1 bg-gray-700 text-white py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;