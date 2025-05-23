import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export default function MapCreationModal({ showModal, userId }) {
  const navigate = useNavigate();
  const [mapName, setMapName] = useState("");
  const [isCreatingMap, setIsCreatingMap] = useState(false);
  const [error, setError] = useState("");

  const handleMapCreation = async () => {
    if (!mapName.trim()) {
      setError("Please enter a map name");
      return;
    }
    try {
      setIsCreatingMap(true);

      const response = await fetch(
        "http://localhost:8080/api/v2/maps/create-map",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            creator_id: userId,
            name: mapName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create map");
      }

      setMapName("");
      const data = await response.json(); // probably want error handling
      navigate(`/map/${userId}/${data.newMapData.id}`);
    } catch (err) {
      console.log("Error creating map", err);
      setError(err.message);
    } finally {
      setIsCreatingMap(false);
    }
  };

  return (
    <>
      <div
        className={`creation-modal-container ${
          showModal ? "visible" : "hidden"
        }`}
      >
        <p className="modal-header">Create a new mind map!</p>
        <div className="modal-submission">
          <input
            placeholder="Map Name"
            type="text"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
          ></input>
          <div
            className="submission-button"
            onClick={!isCreatingMap && handleMapCreation}
          >
            <p className="submission-text">
              {isCreatingMap ? (
                <ClipLoader size={15} color="white" />
              ) : (
                "Create"
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
