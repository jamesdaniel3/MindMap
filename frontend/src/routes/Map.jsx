import { useParams } from "react-router-dom";

export default function Map() {
  const { uid, map_id } = useParams();

  return (
    <>
      <p>User ID: {uid}</p>
      <p>Map ID: {map_id}</p>
      <p>This is the map page</p>
    </>
  );
}
