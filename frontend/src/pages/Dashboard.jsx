import { useSelector } from "react-redux";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  

  const user = useSelector((state) => state.auth.user);

  
  if (!user) {
    return null;
  }

  if (user.role === "student") {
    return <StudentDashboard />;
  }

  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return null;
};

export default Dashboard;