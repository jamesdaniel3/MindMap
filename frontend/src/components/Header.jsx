import "../styles/header.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header({ displayName }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out successfully");
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <div className="header-content">
        <p>{displayName}</p>
        <p>Mind Map</p>
        <p onClick={handleSignOut} className="sign-out-text">
          Sign Out
        </p>
      </div>
    </>
  );
}
