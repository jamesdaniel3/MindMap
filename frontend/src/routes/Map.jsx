import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import ContentModal from "../components/ContentModal";

import "@xyflow/react/dist/style.css";
import "../styles/map.css";

export default function Map() {
  const { uid, map_id } = useParams();
  const [mapInfo, setMapInfo] = useState({});
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const horizontalSpacing = 250; // Horizontal space between nodes
  const verticalSpacing = 150; // Vertical space between levels
  const navigate = useNavigate();

  // Function to generate nodes and edges using BFS
  const generateGraphData = useCallback((data) => {
    if (!data || !data.nodes || data.nodes.length === 0)
      return { nodes: [], edges: [] };

    // Map to track visited nodes
    const visited = new Set();
    // Queue for BFS
    const queue = [];
    // Result nodes and edges
    const resultNodes = [];
    const resultEdges = [];

    // Map to store node data by ID for quick lookup
    const nodeMap = {};
    data.nodes.forEach((node) => {
      nodeMap[node.id] = node;
    });

    // Find nodes with no prerequisites to start BFS
    const startNodes = data.nodes.filter((node) => node.prereqs.length === 0);

    // Initialize BFS with start nodes
    startNodes.forEach((node, index) => {
      queue.push({
        node,
        level: 0,
        position: index,
      });
    });

    // Track the number of nodes at each level for positioning
    const levelCounts = {};

    // BFS traversal
    while (queue.length > 0) {
      const { node, level, position } = queue.shift();

      if (visited.has(node.id)) continue;
      visited.add(node.id);

      // Track how many nodes are at this level
      if (!levelCounts[level]) levelCounts[level] = 0;
      levelCounts[level]++;

      // Calculate x position based on the number of nodes at this level
      const x = position * horizontalSpacing;
      const y = level * verticalSpacing;

      resultNodes.push({
        id: String(node.id), // Convert to string to ensure compatibility
        position: { x, y },
        data: { label: node.name },
        style: {
          width: 180,
          padding: 10,
          border: "1px solid #ddd",
          borderRadius: 5,
        },
      });

      // Create edges for each postrequisite
      node.postreqs.forEach((targetId) => {
        if (nodeMap[targetId]) {
          resultEdges.push({
            id: `e${node.id}-${targetId}`,
            source: String(node.id), // Convert to string
            target: String(targetId), // Convert to string
            animated: false,
            style: { stroke: "#888" },
          });

          // Add target to queue if not visited
          if (!visited.has(targetId)) {
            queue.push({
              node: nodeMap[targetId],
              level: level + 1,
              position: levelCounts[level + 1] || 0,
            });
          }
        }
      });
    }

    // Improve node positioning by centering nodes at each level
    const levelNodes = {};
    resultNodes.forEach((node) => {
      const level = node.position.y / verticalSpacing;
      if (!levelNodes[level]) levelNodes[level] = [];
      levelNodes[level].push(node);
    });

    // Adjust horizontal positions to center nodes at each level
    Object.keys(levelNodes).forEach((level) => {
      const nodesAtLevel = levelNodes[level];
      const totalWidth = nodesAtLevel.length * horizontalSpacing;
      const startX = -totalWidth / 2 + horizontalSpacing / 2;

      nodesAtLevel.forEach((node, index) => {
        node.position.x = startX + index * horizontalSpacing;
      });
    });

    return { nodes: resultNodes, edges: resultEdges };
  }, []);

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
  }, [mapInfo, generateGraphData]);

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
