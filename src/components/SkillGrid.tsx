import React from "react";
import { Skill } from "../types";
import { Box } from "@mui/material";

type GridProps = Pick<Skill, "range" | "shape" | "shapeParam" | "skillRange">;

const SkillGrid: React.FC<GridProps> = ({
  range,
  shape,
  shapeParam,
  skillRange,
}) => {
  function processInput(input: string) {
    const parts = input.split(",").map(Number);
    return parts.map((val) => (val % 100 ? val : val / 100));
  }
  const gridRange = processInput(range);
  const gridShape = processInput(shapeParam);

  //grid - actual # of grids

  //range - blue
  //shape - orange

  //skillRange - type of range (blue)
  // 1 - self
  // 2 - range x range (ullrid s1/s2)
  // 3 - aoe radius (taxicab)
  // 7 - custom/cross (ullrid ult/lenna)
  // 8 - full map

  //shape
  // 1 - single target
  // 2 - shapeParam x shapeParam
  // 3 - aoe radius
  // 5 - range x shape excluding range (krolik/qj) always line? currently coded as such
  // 7 - custom/rectangle (vepley/littara/sabrina/lotta)
  // 8 - full map (sabrina)
  // 9 -?
  // 10-?

  // Determine grid size (accommodates both range and AoE)
  const gridSize =
    shape == 8 || skillRange == 8
      ? 21
      : [9, 17, 21].find((val) => val > 2 * (gridRange[0] + gridShape[0])) ??
        21;

  // Grid rendering logic
  const renderGrid = () => {
    const gridElements = [];
    const center = Math.floor(gridSize / 2); // Center of the grid (keep in mind 0-indexing)

    let targetFlag = false;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Calculate distance from the center square
        const distanceFromCenter =
          Math.abs(row - center) + Math.abs(col - center);

        let backgroundColor = "background.default"; // Default for out-of-range squares

        console.log(
          "skillRange",
          skillRange,
          "gridRange",
          gridRange,
          "shape",
          shape,
          "gridShape",
          gridShape
        );

        let inRange = false;
        switch (
          skillRange // blue (range)
        ) {
          case 2:
            if (
              Math.abs(center - row) <= Math.floor(gridRange[0] / 2) &&
              Math.abs(center - col) <= Math.floor(gridRange[0] / 2)
            )
              inRange = true;
            break;
          case 3:
            if (distanceFromCenter <= gridRange[0]) inRange = true;
            break;
          case 7:
            let range7 = 0;
            switch (gridRange[0]) {
              case 30: //Ullrid
                range7 = 5;
                break;
              case 71: //Lenna
                range7 = 3;
                break;
            }
            if (
              row == center && Math.abs(center - col) <= range7  || col == center && Math.abs(center - row) <= range7
            )
            inRange = true;
            break;
        }
        if (inRange) backgroundColor = "info.main";
        let inShape = false;
        switch (
          shape // orange (aoe)
        ) {
          case 1:
            if (!targetFlag && inRange && col == center) {
              targetFlag = true;
              inShape = true;
            }
            break;
          case 2:
            if (
              Math.abs(center - row - gridRange[0]) <=
                Math.floor(gridShape[0] / 2) &&
              Math.abs(center - col) <= Math.floor(gridShape[0] / 2)
            )
              inShape = true;
            break;
          case 3:
            if (
              Math.abs(row - center + gridRange[0]) + Math.abs(col - center) <=
              gridShape[0]
            )
              inShape = true;
            break;
          case 5:
            if (
              center - row > 1 &&
              center - row <= gridShape[0] &&
              col == center
            )
              inShape = true;
            break;
          case 8:
            inShape = true;
            break;
          case 7:
            let shape7 = [0, 0];
            switch (gridShape[0]) {
              case 67: //Sabrina
                shape7 = [3, 6];
                break;
              case 68: //Vepley S1
              case 38: //Lotta
                shape7 = [3, 5];
                break;
              case 69: //Vepley S1 Key
                shape7 = [5, 3];
                break;
              case 78: //Littara
                shape7 = [3, 8];
                break;
            }
            if (
              center - row > 0 &&
              center - row <= shape7[1] &&
              Math.abs(center - col) <= Math.floor(shape7[0] / 2)
            )
              inShape = true;
            break;
        }
        if (inShape) backgroundColor = "secondary.main";
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
