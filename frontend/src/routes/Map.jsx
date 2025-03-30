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

      // Calculate x and y coordinates for node positioning
      // We'll position nodes in a grid-like structure

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

  // Function to handle node click (for future content display)
  const onNodeClick = useCallback((event, node) => {
    console.log("Node clicked:", node);
    // Here you can implement the logic to display node content
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
