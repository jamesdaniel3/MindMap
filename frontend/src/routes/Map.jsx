import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import ContentModal from "../components/ContentModal";
import generateGraphData from "../utils/MapFunctions";

import "@xyflow/react/dist/style.css";
import "../styles/map.css";

export default function Map() {
  const { uid, map_id } = useParams();
  const [mapInfo, setMapInfo] = useState({});
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMapInfo = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v2/maps/load-map",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ userID: uid, mapId: map_id }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Map info retrieved", data);
          setMapInfo(data);
        } else {
          console.error("Failed to retrieve map info:", data);
        }
      } catch (err) {
        console.error("Error fetching map data:", err);
      }
    };
    fetchMapInfo();
  }, [uid, map_id]);

  useEffect(() => {
    if (mapInfo && mapInfo.fullMapInfo) {
      const { nodes: graphNodes, edges: graphEdges } = generateGraphData(
        mapInfo.fullMapInfo
      );
      console.log("Generated nodes:", graphNodes);
      console.log("Generated edges:", graphEdges);
      setNodes(graphNodes);
      setEdges(graphEdges);
    }
  }, [mapInfo]);

  // Function to handle node click and display modal
  const onNodeClick = useCallback(
    (event, node) => {
      // Find the full node data from the correct location in mapInfo
      if (mapInfo && mapInfo.fullMapInfo && mapInfo.fullMapInfo.nodes) {
        const nodeData = mapInfo.fullMapInfo.nodes.find(
          (n) => String(n.id) === node.id
        );
        if (nodeData) {
          setSelectedNode(nodeData);
          setShowModal(true);
        }
      }
    },
    [mapInfo]
  );

  const closeModal = () => {
    setShowModal(false);
  };

  function handleGoBack() {
    navigate(`/home`);
  }

  return (
    <div className="map-container">
      <div className="back-button-container" onClick={handleGoBack}>
        <p className="back-home-text">Back To Maps</p>
      </div>
      {nodes.length > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          nodeTypes={{}}
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      ) : (
        <div className="loading-container">
          <p>Loading map data or no nodes available...</p>
        </div>
      )}

      {mapInfo && mapInfo.fullMapInfo && (
        <ContentModal
          showModal={showModal}
          selectedNode={selectedNode}
          userContents={mapInfo.userContents}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
