import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, BASE_URL2 } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetUser } from "../utils/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [isEdit, setIsEdit] = useState(false);

  const [profile, setProfile] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [year, setYear] = useState("");
  

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(BASE_URL2 + "/me", { withCredentials: true });
      dispatch(GetUser(res.data.user));
      const user = res.data.user;
      setProfile(user);
      setFirstName(user.firstName);
      setLastName(user.lastName || "");
      setYear(user.year);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await axios.put(
        BASE_URL2 + "/update",
        {
          firstName,
          lastName,
          year,
        },
        { withCredentials: true }
      );
      dispatch(
        GetUser({
          user: res.data.user,
        })
      );

      setIsEdit(false);
      setSuccess("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update Profile");
    }
  };

  if (!profile) {
    return <div className="text-center font-bold mt-10">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-100 to-indigo-300 flex justify-center pt-10">
      <div className="w-[90%] md:w-full max-w-xl bg-white rounded-lg shadow p-6 mb-10">
        <h2 className="text-2xl font-semibold text-center text-indigo-900">
          Student Profile
        </h2>
        {success && (
          <p className="text-green-600 text-center mt-2">{success}</p>
        )}
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}

        <div className="mt-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">First Name</span>
            {isEdit ? (
              <input
                className="border px-2 py-1 rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            ) : (
              <span className="font-medium">{user.firstName}</span>
            )}
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Last Name</span>
            {isEdit ? (
              <input
                className="border px-2 py-1 rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            ) : (
              <span className="font-medium">{user.lastName || ""}</span>
            )}
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Registration Number</span>

            <span className="font-medium">{user.regNumber}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Department</span>

            <span className="font-medium">{user.department}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Year</span>
            {isEdit ? (
              <select
                className="border px-2 py-1 rounded"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            ) : (
              <span className="font-medium">{user.year}</span>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {!isEdit ? (
            <>
              <button
                className="flex-1 bg-indigo-900 hover:bg-indigo-800 text-white py-2 rounded-md"
                onClick={() => setIsEdit(true)}
              >
                Edit Profile
              </button>

              <button
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </button>
            </>
          ) : (
            <>
              <button
                className="flex-1 bg-green-600 text-white py-2 rounded-md"
                onClick={handleUpdateProfile}
              >
                Save Changes
              </button>

              <button
                className="flex-1 bg-gray-600 text-white py-2 rounded-md"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="  bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md px-9"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
