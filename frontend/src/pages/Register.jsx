import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { loginSuccess } from "../utils/authSlice";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
    const [regNumber, setRegNumber] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch=useDispatch();
  

  const handleRegistration = async () => {
    if (
        !firstName ||
        !email ||
        !department ||
        !regNumber ||
        !year ||
        !password ||
        !confirmPassword
      ) {
        setError("Please fill all the mandatory fields");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    try {
      
      const res = await axios.post(
        BASE_URL + "/register",
        {
          firstName,
          lastName,
          email,
          department,
          regNumber,
          year,
          password,
        },
        { withCredentials: true }
      );

      dispatch(
        loginSuccess({
          user:res.data.user,
        })
      )

      return navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center ">
      <div className="w-[90%] md:w-full max-w-md bg-white rounded-lg p-8 mt-10 mb-10">
        <h1 className="text-2xl font-semibold text-center text-indigo-900">
          Student Registration
        </h1>
        <p className="text-center text-gray-600 mt-1">Create your account</p>

        <div className="mt-6">
          <label className="block text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e)=> {setEmail(e.target.value);
            setError("");
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            value={firstName}
            placeholder="Enter your first name"
            onChange={(e)=>{setFirstName(e.target.value);
            setError("");}}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={lastName}
            placeholder="Enter your last name"
            onChange={(e)=>{setLastName(e.target.value);
            setError("");}}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Registration Number *</label>
          <input
            type="text"
            value={regNumber}
            placeholder="Enter your Registration Number"
            onChange={(e)=>{setRegNumber(e.target.value);
            setError("");}}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Department *</label>
          <select 
          value={department}
          onChange={(e)=>{setDepartment(e.target.value);
          setError("");}}
          className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="EE">EE</option>
            <option value="Civil">Civil</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Year *</label>
          <select 
          value={year}
          onChange={(e)=>{setYear(e.target.value);
          setError("");}}
          className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Select Year</option>
            <option value="1">1st year</option>
            <option value="2">2nd year</option>
            <option value="3">3rd year</option>
            <option value="4">4th year</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Password *</label>
          <input
            type="password"
            input={password}
            placeholder="Create a password"
            onChange={(e)=>{setPassword(e.target.value)
            ;
            setError("");}}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Confirm Password *</label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm your password"
            onChange={(e)=>{setConfirmPassword(e.target.value);
            setError("");}}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          className="w-full bg-indigo-900 hover:bg-indigo-800 text-white py-2 rounded-md mt-6"
          onClick={handleRegistration}
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?
          <Link
            to="/login"
            className="cursor-pointer text-indigo-800 hover:text-indigo-500 font-semibold"
          >
            {" "}
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
