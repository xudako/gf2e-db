import React from "react";
import { Skill } from "../types";
import { Box } from "@mui/material";

type GridProps = Pick<Skill, "range" | "shape" | "shapeParam" | "skillRange">;

const SkillGrid: React.FC<GridProps> = ({
  range,
  shape,
  shapeParam,
}) => {
  function processInput(input: string) {
    const parts = input.split(",").map(Number);
    return parts.map((val) => (val % 100 ? val : val / 100));
  }
  const gridRange = processInput(range);
  const gridShape = processInput(shapeParam);

  //range - blue
  //shape - orange

  //skillRange
  // 1 - self
  // 2 - ?
  // 3 - aoe (taxicab)
  // 7 - irregular (Ullrid line)
  // 8 - full map

  //shape
  // 1 - single target
  // 2 - shapeParam x shapeParam
  // 3 - aoe radius
  // 5 - range x shape excluding range (krolik/qj)
  // 7 - rectangle (vepley)
  // 8 - full map (sabrina)
  // 9 -?
  // 10-?

  // Determine grid size (accommodates both range and AoE)
  const gridSize =
    [9, 13, 17, 21].find(
      (val) => val > 2 * (gridRange[0] + gridShape[0]) + 1
    ) ?? 21;

  // Grid rendering logic
  const renderGrid = () => {
    const gridElements = [];
    const center = Math.floor(gridSize / 2); // Center of the grid

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Calculate distance from the center square
        const distanceFromCenter =
          Math.abs(row - center) + Math.abs(col - center);

        let backgroundColor = "background.default"; // Default for out-of-range squares

        //console.log("range", gridRange, 'shape', shape, 'sP', gridShape);

        if (distanceFromCenter <= gridRange[0]) { // blue (range)
          backgroundColor = "info.main";
        }
        let bg = false;
        switch (shape) { // orange (aoe)
          case 1:
          case 3:
            if (
              Math.abs(row - center + gridRange[0]) + Math.abs(col - center) <=
              gridShape[0]
            )
              bg = true;
            break;
          case 2:
            if (
              Math.abs(center - row - gridRange[0]) <=
              Math.floor(gridShape[0] / 2) && Math.abs(center-col) <= Math.floor(gridShape[0] / 2)
            )
              bg = true;
            break;
          case 5:
            if (
              Math.abs(
                center - row - gridRange[0] - Math.floor(gridShape[1] / 2)
              ) <= Math.floor(gridShape[1] / 2) &&
              Math.abs(col - center) <= Math.floor(gridShape[0] / 2)
            )
              bg = true;
            break;
          case 8:
            bg = true;
            break;
          case 7:
            switch (gridShape[0]) {
              case 67: //Sabrina
                break;
              case 68: //Vepley
                break;
              case 69: //Vepley
                break;
              case 78: //Littara
                break;
            }
        }
        if (bg) backgroundColor = "secondary.main";
        if (distanceFromCenter === 0) {
          backgroundColor = "white";
        }

        gridElements.push(
          <Box
            key={`${row}-${col}`}
            sx={{
              width: "100%",
              paddingBottom: `${100 / gridSize}%`,
              backgroundColor,
              border: "1px solid #dddddd",
              boxSizing: "border-box",
              position: "relative",
            }}
          />
        );
      }
    }
    return gridElements;
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        maxWidth: "100%",
        aspectRatio: "1",
        position: "relative",
      }}
    >
      {renderGrid()}
    </Box>
  );
};

export default SkillGrid;