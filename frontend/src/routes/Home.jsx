import { useEffect, useState } from "react";
import Header from "../components/Header";
import MapCard from "../components/MapCard";
import ClipLoader from "react-spinners/ClipLoader";
import MapCreationModal from "../components/MapCreationModal";

import "../styles/home.css";
import NewMap from "../assets/images/new-map1.png";

function Home({ userInfo }) {
  const [maps, setMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMapCreator, setShowMapCreator] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);

        // Create/find user first
        const formattedUserInfo = {
          googleUserId: userInfo.uid,
          displayName: userInfo.displayName,
          email: userInfo.email,
          photo_url: userInfo.photoURL,
        };

        const userResponse = await fetch(
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

        if (!userResponse.ok) {
          const userData = await userResponse.json();
          throw new Error(userData.error || "Failed to create/find user");
        }

        // Then fetch maps
        const mapsResponse = await fetch(
          `http://localhost:8080/api/v2/maps/user-find-all/${userInfo.uid}`
        );

        if (mapsResponse.ok) {
          const mapsData = await mapsResponse.json();
          setMaps(mapsData.allMapData);
        } else {
          setError("No maps found.");
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo?.uid) {
      initializeUser();
    }
  }, [userInfo?.uid]);

  function handleOpenModal() {
    setShowMapCreator(true);
  }

  function handleCloseModal() {
    setShowMapCreator(false);
  }

  return (
    <>
      <Header displayName={userInfo.displayName} />
      {isLoading ? (
        <div className="loading-container">
          <ClipLoader size={50} />
        </div>
      ) : (
        <>
          <div className={`home-content ${showMapCreator ? "modal-open" : ""}`}>
            <div className="map-cards-container">
              <div className="map-card" onClick={handleOpenModal}>
                <p className="map-title">Create a new map</p>
                <img src={NewMap} className="new-map-image" alt="New Map" />
              </div>
              {maps.map((mapInfo) => (
                <MapCard
                  key={mapInfo.id}
                  mapInfo={mapInfo}
                  userInfo={userInfo}
                />
              ))}
            </div>
          </div>

          {/* Modal backdrop */}
          <div
            className={`modal-backdrop ${showMapCreator ? "" : "hidden"}`}
            onClick={handleCloseModal}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <MapCreationModal
                showModal={showMapCreator}
                userId={userInfo.uid}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
