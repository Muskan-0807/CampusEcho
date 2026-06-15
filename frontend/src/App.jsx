import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import NewIssue from "./pages/NewIssue";
import MyIssues from "./pages/MyIssues";
import AllIssues from "./pages/AllIssues";

function App() {
  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>


          <Route path="/" element={<MainLayout/>} >
            <Route index element={<Dashboard />}/>


          <Route path="/profile" element={<Profile />}/>
          <Route path="/change-password" element={<ChangePassword />}/>
          <Route path="/newissue" element={<NewIssue/>} />
          <Route path="/myissues" element={<MyIssues/>} />
          <Route path="/allissues" element={<AllIssues/>} />

          </Route>
          

        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
