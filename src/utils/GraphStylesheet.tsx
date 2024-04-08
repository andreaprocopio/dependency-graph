export const styleSheet = [
  {
    selector: "node",
    style: {
      backgroundColor: "#4a56a6",
      width: 30,
      height: 30,
      label: "data(label)",
      "overlay-padding": "6px",
      "z-index": "10",
      "text-outline-color": "#4a56a6",
      "text-outline-width": "2px",
      color: "white",
      fontSize: 20,
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-width": "6px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
      "background-color": "#77828C",
      width: 25,
      height: 25,
      "text-outline-color": "#77828C",
      "text-outline-width": 8,
    },
  },
  {
    selector: "node[type='device']",
    style: {
      shape: "rectangle",
    },
  },
  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#AAD8FF",
      "target-arrow-color": "#6774cb",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
];
