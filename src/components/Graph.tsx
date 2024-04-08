import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_DEPENDENCIES } from "../graphql/getDependencies.js";
import cytoscape from "cytoscape";
import { styleSheet } from "../utils/GraphStylesheet.js";

// Data types
type Node = {
  id: number;
  name: string;
  label: string;
};

type Edge<T extends string, U extends string> = {
  [K in T | U]: {
    id: number;
  };
} & {
  label: string;
};

type DependencyEdge = Edge<"dependant", "dependedUpon">;
type HierarchyEdge = Edge<"parent", "children">;
type MembershipEdge = Edge<"parent", "member">;

// Graph Types
type GraphNode = {
  data: {
    id: string;
    label: string;
  };
};

type GraphEdge = {
  data: {
    id: string;
    source: string;
    target: string;
  };
};

type GraphData = (GraphNode | GraphEdge)[];

const Graph = () => {
  const width = "100%";
  const height = "90vh";
  const selectedNodeRef = useRef<HTMLInputElement>(null);
  const selectedEdgeRef = useRef<HTMLInputElement>(null);
  const [layoutType, setLayoutType] = useState("circle");
  const [graphData, setGraphData] = useState([] as GraphData);

  const { loading, error, data } = useQuery(GET_DEPENDENCIES, {
    variables: {
      projectId: 287,
      versionId: "2e718ebd3f968a675dfbc36bb4a126e13186eddf",
    },
  });

  useEffect(() => {
    if (data) {
      setGraphData([
        ...data.projectById.dependencyGraph.allContainers.map(
          (container: Node) => ({
            data: {
              id: container.id,
              label: container.name,
            },
          })
        ),
        ...data.projectById.dependencyGraph.allUnits.map((unit: Node) => ({
          data: {
            id: unit.id,
            label: unit.name,
          },
        })),
        ...data.projectById.dependencyGraph.dependencyEdges.map(
          (dependency: DependencyEdge) => ({
            data: {
              source: dependency.dependant.id,
              target: dependency.dependedUpon.id,
              label: dependency.label,
            },
          })
        ),
        ...data.projectById.dependencyGraph.hierarchyEdges.map(
          (hierarchy: HierarchyEdge) => ({
            data: {
              source: hierarchy.parent.id,
              target: hierarchy.children.id,
              label: hierarchy.label,
            },
          })
        ),
        ...data.projectById.dependencyGraph.membershipEdges.map(
          (membership: MembershipEdge) => ({
            data: {
              source: membership.parent.id,
              target: membership.member.id,
              label: membership.label,
            },
          })
        ),
      ]);
    }
  }, [data]);

  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: graphData,
      style: styleSheet,
    });

    cy.layout({ name: layoutType }).run();
  }, [graphData]);

  // Changing layout type
  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: graphData,
      style: styleSheet,
    });

    cy.layout({ name: layoutType }).run();
  }, [layoutType]);

  const filterGraph = () => {
    const selectedNode = selectedNodeRef.current?.value;
    const selectedEdge = selectedEdgeRef.current?.value;

    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: graphData,
      style: styleSheet,
    });

    if (selectedNode !== "") {
      cy.nodes().forEach((node) => {
        if (!node.data("label").includes(selectedNode)) {
          node.remove();
        }
      });
    }

    if (selectedEdge !== "") {
      cy.edges().forEach((edge) => {
        if (!edge.data("label").includes(selectedEdge)) {
          edge.remove();
        }
      });
    }

    cy.layout({ name: layoutType }).run();
  };

  return (
    <>
      <h1>Dependency Graph</h1>
      <div>
        <label>Node label</label>
        <input type="text" ref={selectedNodeRef} />
        <br />
        <br />
        <label>Edge label</label>
        <input type="text" ref={selectedEdgeRef} />
        <br />
        <br />
        <button onClick={filterGraph}>Filter</button>
        <br />
        <br />
        <label>Layout</label>
        <select
          value={layoutType}
          onChange={(e) => setLayoutType(e.target.value)}
        >
          <option value="grid">Grid</option>
          <option value="circle">Circle</option>
          <option value="concentric">Concentric</option>
          <option value="breadthfirst">Breadth First</option>
          <option value="cose">Cose</option>
        </select>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <div id="cy" style={{ width, height }} />
      </div>
    </>
  );
};

export default Graph;
