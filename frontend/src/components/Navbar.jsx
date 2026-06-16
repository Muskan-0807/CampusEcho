import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; 
import {logout} from "../utils/authSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Navbar = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
    const [open,setOpen]= useState(false);

  const user= useSelector((store)=> store.auth.user);
  // const isAuthenticated= useSelector((store)=>store.auth.isAuthenticated);
  if(!user) return null;
  

  const handleLogout = async() => {
    try{
      await axios.post(BASE_URL+"/logout",{},{withCredentials:true});
      dispatch(logout());
      return navigate("/login");

    }catch(err){
      setError(err.response?.data?.message || "LogOut unsuccessfull");

    }
  }

  return (
    <nav className=" bg-gray-900 text-white min-w-full">
      <div className=" mx-auto px-2 py-2 md:px-8 md:py-5 flex items-center justify-between ">

        <Link to="/" className="font-semibold font-serif text-md md:text-2xl">
          CampusEcho
        </Link>
        {user.role === "student" && ( <div className="flex items-center gap-2 md:gap-15 lg:gap-15 text-sm md:text-lg px-2 md:px-0">
    
              <Link to="/" className="cursor-pointer hover:text-indigo-300 ">Dashboard</Link>
              <Link to="/allissues" className="cursor-pointer hover:text-indigo-300">All Issues</Link>
              <Link to="/myissues" className="cursor-pointer hover:text-indigo-300">My Issues</Link>
        </div> )}
        {user.role ==="admin" && (
          <div> 
          <Link to="/" className="cursor-pointer hover:text-indigo-300">All Issues</Link>

          </div>

        )}
        
        
        {user.role === "student" && (
          <div className="relative text-sm md:text-lg">
          <div className="cursor-pointer flex flex-row items-baseline" onClick={()=> setOpen(!open)}>
          
          <span> {user ? user.firstName : ""} </span>
          <span className="text-sm mx-2"> ▼ </span></div>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-md overflow-hidden">
              <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                <Link to="/profile">View Profile</Link>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="px-4 py-2 cursor-pointer hover:bg-red-50"
              onClick={(e)=> { e.stopPropagation();

              handleLogout();
              }}>Logout</div>
            </div>
          )}
        </div>

        )}
         {user.role === "admin" && (
          <div className="relative text-lg">
          <div className="cursor-pointer" onClick={()=> setOpen(!open)}>
          
          <span> Authority </span>
          <span className="text-sm mx-2"> ▼ </span></div>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-md overflow-hidden">
            
              <div className="h-px bg-gray-200"></div>
              <div className="px-4 py-2 cursor-pointer hover:bg-red-50"
               onClick={(e)=> { e.stopPropagation();

              handleLogout();
              }}>Logout</div>

            </div>
          )}
        </div>

        )}      
        
      </div>
    </nav>
  )
}

export default Navbar;