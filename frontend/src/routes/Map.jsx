import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import fakeJson from "../assets/fake_json.json";
import { ReactFlow, Background, Controls } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

export default function Map() {
  const { uid, map_id } = useParams();
  const [mapInfo, setMapInfo] = useState({});
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const horizontalSpacing = 250; // Horizontal space between nodes
  const verticalSpacing = 150; // Vertical space between levels

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
    startNodes.forEach((node) => {
      queue.push({
        node,
        level: 0,
        position: 0,
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

      // Create node for ReactFlow
      resultNodes.push({
        id: node.id,
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
            source: node.id,
            target: targetId,
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
    // Load data from your source
    setMapInfo(fakeJson);
  }, []);

  useEffect(() => {
    if (mapInfo && mapInfo.nodes) {
      const { nodes: graphNodes, edges: graphEdges } =
        generateGraphData(mapInfo);
      setNodes(graphNodes);
      setEdges(graphEdges);
    }
  }, [mapInfo, generateGraphData]);

  // Function to handle node click and display modal
  const onNodeClick = useCallback(
    (event, node) => {
      console.log("Node clicked:", node);

      // Find the full node data from mapInfo
      const nodeData = mapInfo.nodes.find((n) => n.id === node.id);
      if (nodeData) {
        setSelectedNode(nodeData);
        setShowModal(true);
      }
    },
    [mapInfo]
  );

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView>
        <Background />
        <Controls />
      </ReactFlow>

      {/* Slide-in Modal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "75%",
          height: "100%",
          backgroundColor: "white",
          boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s ease-in-out",
          transform: showModal ? "translateX(0)" : "translateX(100%)",
          zIndex: 1000,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {selectedNode && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>{selectedNode.name}</h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Completed
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 15px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Content
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedNode.contents &&
                    selectedNode.contents.map((content) => {
                      // Find corresponding user content for completion status
                      const userContent = mapInfo.userContents?.find(
                        (uc) => uc.id === content.id
                      );
                      const isCompleted = userContent
                        ? userContent.completed
                        : false;

                      return (
                        <tr
                          key={content.id}
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          <td style={{ padding: "12px 15px" }}>
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              readOnly
                            />
                          </td>
                          <td style={{ padding: "12px 15px" }}>
                            <a
                              href={`/content/${content.id}`}
                              style={{
                                color: "#0066cc",
                                textDecoration: "none",
                                fontWeight: "500",
                              }}
                            >
                              {content.title}
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Optional backdrop */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 999,
          }}
          onClick={closeModal}
        />
      )}
    </div>
  );
}
