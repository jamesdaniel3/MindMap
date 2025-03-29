// src/Login.jsx
import { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Import the auth instance from your firebase config file
import { auth } from "../firebase";

function Login({ setUserInfo }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  // Check authentication state when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Pass user ID to parent component via prop
        setUserInfo(currentUser.uid);

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
      await signInWithPopup(auth, googleProvider);
      // Redirect will happen in useEffect when auth state changes
    } catch (error) {
      setError(error.message);
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <button onClick={handleGoogleSignIn} disabled={loading}>
        {loading ? "Connecting..." : "Sign in with Google"}
      </button>
    </div>
  );
}

export default Login;
