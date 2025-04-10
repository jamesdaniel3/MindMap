import { useNavigate } from "react-router-dom";

export default function MapCard({ mapInfo, userInfo }) {
  const navigate = useNavigate();

  function handleMapCardClick() {
    navigate(`/map/${userInfo.uid}/${mapInfo.id}`);
  }

  return (
    <>
      <div className="map-card" onClick={handleMapCardClick}>
        <p className="map-title">{mapInfo.name}</p>
      </div>
    </>
  );
}
