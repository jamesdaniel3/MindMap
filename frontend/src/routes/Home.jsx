import { useEffect, useState } from "react";
import Header from "../components/Header";
import MapCard from "../components/MapCard";

import "../styles/home.css";
import NewMap from "../assets/images/new-map1.png";

function Home({ userInfo }) {
  const [maps, setMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMapInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/maps`);
        const data = await response.json();
        console.log(data);
        if (data.statusCode === 200) {
          setMaps(data.data);
          setIsLoading(false);
        } else {
          setError("No menu items found.");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Error fetching menu items:", err);
      }
    };

    fetchMapInfo();
  }, []);

  if (isLoading) {
    return (
      <>
        <p>Loading ...</p>
      </>
    );
  }

  return (
    <>
      <Header displayName={userInfo.displayName} />
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
    </>
  );
}

export default Home;
