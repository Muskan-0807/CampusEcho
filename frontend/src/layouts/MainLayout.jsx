import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth } from "../utils/authSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user= useSelector((state)=> state.auth.user);

  const fetchUser = async () => {
    
    try {
      const res = await axios.get(BASE_URL + "/me", {
        withCredentials: true,
      });
      dispatch(
        restoreAuth({
          user: res.data.user,
        })
      );
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }

      console.log(err);
    }
  };
  useEffect(() => {
    if (user) return;
    fetchUser();
  }, [dispatch,navigate,user]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-indigo-100 to-indigo-300">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
