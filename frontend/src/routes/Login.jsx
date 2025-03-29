// src/Login.jsx
import { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { particlesConfig } from "../config/particlesConfig";

import { auth } from "../firebase";
import googleLogo from "../assets/images/google-logo.png";

import "../styles/login.css";

function Login({ setUserInfo }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const googleProvider = new GoogleAuthProvider();

  // Check authentication state when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Pass user info (id and name) to parent component via prop
        const userInfo = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || "User", // Fallback if name is null
          email: currentUser.email,
          photoURL: currentUser.photoURL, // Profile picture URL
        };

        // Set the user info in the parent component
        setUserInfo(userInfo);

        // Redirect to home page
        navigate("/home");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate, setUserInfo]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);

      // For debugging - log the user object to see all available properties
      console.log("Google sign in result:", result.user);

      // Redirect will happen in useEffect when auth state changes
    } catch (error) {
      setError(error.message);
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const particlesLoaded = (container) => {
    console.log(container);
  };

  return (
    <div className="content">
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particlesConfig}
        />
      )}
      <p className="login-site-name">Mind Map</p>
      {error && <div>{error}</div>}
      <div onClick={handleGoogleSignIn} className="sign-in-button">
        <img src={googleLogo} className="google-logo"></img>
        <p>{loading ? "Connecting..." : "Sign in with Google"}</p>
      </div>
    </div>
  );
}

export default Login;
