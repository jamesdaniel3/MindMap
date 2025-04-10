import { useEffect, useState } from "react";
import Header from "../components/Header";
import MapCard from "../components/MapCard";
import ClipLoader from "react-spinners/ClipLoader";

import "../styles/home.css";
import NewMap from "../assets/images/new-map1.png";

function Home({ userInfo }) {
  const [maps, setMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMapInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v2/maps/find-all`
        );
        const data = await response.json();
        if (response.ok) {
          setMaps(data.allMapData);
          setIsLoading(false);
        } else {
          setError("No maps found.");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Error fetching maps:", err);
      }
    };

    const createUserIfNeeded = async () => {
      try {
        const formattedUserInfo = {
          googleUserId: userInfo.uid,
          displayName: userInfo.displayName,
          email: userInfo.email,
          photo_url: userInfo.photoURL,
        };

        const response = await fetch(
          "http://localhost:8080/api/v2/users/find-or-create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(formattedUserInfo),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("User created/found successfully:", data.user);
        } else {
          console.error("Error response:", data);
          setError("Error: " + (data.error || "Unknown error"));
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Full error:", err);
        setError("User could not be added to the DB: " + err.message);
        setIsLoading(false);
      }
    };

    createUserIfNeeded();
    fetchMapInfo();
  }, []);

  return (
    <>
      <Header displayName={userInfo.displayName} />
      {isLoading ? (
        <div className="loading-container">
          <ClipLoader size={50} />
        </div>
      ) : (
        <div className="home-content">
          <div className="map-cards-container">
            <div className="map-card">
              <p className="map-title">Create a new map</p>
              <img src={NewMap} className="new-map-image"></img>
            </div>
            {maps.map((mapInfo) => (
              <MapCard key={mapInfo.id} mapInfo={mapInfo} userInfo={userInfo} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
