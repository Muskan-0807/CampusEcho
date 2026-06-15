import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { loginSuccess } from "../utils/authSlice";



const Login = () => {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[role,setRole]= useState("student");
   const [error, setError] = useState("");
     const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
    
      dispatch(loginSuccess({
        user: res.data.user
      }));
      return navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login unsuccessfull");
    }
  }
return (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">

    <div className="w-full max-w-md bg-white rounded-lg p-8">

  
      <h1 className="text-2xl font-semibold text-center text-indigo-900">
        Campus Echo
      </h1>
      <p className="text-center text-gray-600 mt-1">
        Login to your account
      </p>

      
      <div className="mt-6">
        <label className="block text-gray-700 mb-2">
          Login As
        </label>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" value="student"  
              checked={role==="student"}
              onChange={()=> setRole("student")}
            />Student
            
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" 
            checked={role==="admin"}
              onChange={()=> setRole("admin")} />
            Authority
          </label>
        </div>
      </div>

    
      <div className="mt-4">
        <label className="block text-gray-700 mb-1">
          Email
        </label>
        <input
          type="text"
          value={email}
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          onChange={(e) => {setEmail(e.target.value);
          setError("");
          }}
          
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          placeholder="Enter your password"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          onChange={(e) =>{ setPassword(e.target.value);
          setError("");

          }}

        />
      </div>

  
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}

    
      <button
        onClick={handleLogin}
        className="w-full bg-indigo-900 text-white py-2 rounded-md mt-6 cursor-pointer"
      >
        Login
      </button>

      {role==="student" && (
         <p className="text-center text-sm text-gray-600 mt-4">
      
        Don’t have an account?
        <Link to="/register" className="cursor-pointer text-indigo-800 hover:text-indigo-500 font-semibold"> Register here</Link>
      </p>

      )}
     

    </div>
  </div>

)
};

export default Login;