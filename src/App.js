import React, { useState } from "react";
import Sidebar from "./components/sidebar/sidebar";
import MainPage from "./pages/main-page/main-page";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login-page/login-page";
import CameraPage from "./pages/camera-page/camera-page";
import UsersPage from "./pages/users-page/users";

function App() {
  const [isSideBarVisible, setSidebarVisible] = useState(false);

  const handleModalOverlay = () => {
    setSidebarVisible(false);
  };

  return (
    <div className="app_wrapper">
      {isSideBarVisible ? (
        <div className="dark_bg_overlay" onClick={handleModalOverlay}></div>
      ) : (
        ""
      )}
      <Sidebar
        setSidebarVisible={setSidebarVisible}
        isSideBarVisible={isSideBarVisible}
      />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </div>
  );
}

export default App;
