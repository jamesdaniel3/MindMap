export default function MapCard({ mapInfo }) {
  return (
    <>
      <div className="map-card">
        <p className="map-title">{mapInfo.name}</p>
      </div>
    </>
  );
}
