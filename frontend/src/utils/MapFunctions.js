const horizontalSpacing = 250; // Horizontal space between nodes
const verticalSpacing = 150; // Vertical space between levels

export default function generateGraphData(data) {
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

  // Don't forget to return the result!
  return { nodes: resultNodes, edges: resultEdges };
}
