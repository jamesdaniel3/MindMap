import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./firebase";

import Login from "./routes/Login.jsx";
import Home from "./routes/Home.jsx";

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login setUserInfo={setUserInfo} />} />
        <Route
          path="/home"
          element={
            userInfo ? <Home userInfo={userInfo} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
