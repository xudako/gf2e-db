import React, { useEffect, useRef } from "react";
import { Skill } from "../types";

type GridProps = Pick<Skill, "range" | "shape" | "shapeParam" | "skillRange">;

const SkillGrid: React.FC<GridProps> = ({
  range,
  shape,
  shapeParam,
  skillRange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const processInput = (input: string) => {
    const parts = input.split(",").map(Number);
    return parts.map((val) => (val % 100 ? val : val / 100));
  };
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
    shape === 8 || skillRange === 8
      ? 21
      : [9, 17, 21].find((val) => val > 2 * (gridRange[0] + gridShape[0])) ??
        21;

  const RANGE_COLOR = "#6979d9"; // info color
  const SHAPE_COLOR = "#f26c1c"; // secondary.main color
  const BG_COLOR = "#dddddd";
  const CENTER_COLOR = "#ffffff";
  const CELL_GAP = 1; // Gap between cells in pixels
  const GRID_BG = "#999999"; // Default grid cell color

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    // Make canvas size match container size
    const size = container.clientWidth;
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL_SIZE = size / gridSize;
    const center = Math.floor(gridSize / 2);

    // Clear canvas with background color
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, size, size);

    // Draw grid cells with gaps
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        ctx.fillStyle = row === center && col === center ? CENTER_COLOR : GRID_BG;
        ctx.fillRect(
          col * CELL_SIZE + CELL_GAP,
          row * CELL_SIZE + CELL_GAP,
          CELL_SIZE - CELL_GAP * 2,
          CELL_SIZE - CELL_GAP * 2
        );
      }
    }

    let targetFlag = false;
    // Fill colored cells
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const distanceFromCenter = Math.abs(row - center) + Math.abs(col - center);
        let fillColor = null;

        // console.log(
        //   "skillRange",
        //   skillRange,
        //   "gridRange",
        //   gridRange,
        //   "shape",
        //   shape,
        //   "gridShape",
        //   gridShape
        // );

        // Range check (blue)
        let inRange = false;
        switch (skillRange) {
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
              case 30: //Ullrid/LennaLv2
                range7 = 5;
                break;
              case 32: //UllridLv2
                range7 = 7;
                break;
              case 71: //Lenna
                range7 = 3;
                break;
              case 107:
                range7 = 8;
                break;
            }
            if (
              (row === center && Math.abs(center - col) <= range7) ||
              (col === center && Math.abs(center - row) <= range7)
            )
              inRange = true;
            if (gridRange[0] === 107) {
              if (
                (row === center && Math.abs(center - col) < 4) ||
                (col === center && Math.abs(center - row) < 4)
              )
                inRange = false;
            }
            break;
          case 8:
            inRange = true;
        }

        if (inRange && !(row === center && col === center)) {
          fillColor = RANGE_COLOR;
        }

        // Shape check (orange)
        let inShape = false;
        switch (shape) {
          case 1:
            if (!targetFlag && inRange && col === center) {
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
            if (gridShape[1]) {
              if (
                Math.abs(center - row - gridRange[0]) <=
                  Math.floor(gridShape[1] / 2) &&
                Math.abs(center - col) <= Math.floor(gridShape[1] / 2)
              )
                inShape = false;
            }
            break;
          case 3:
            if (
              Math.abs(row - center + gridRange[0]) + Math.abs(col - center) <=
              gridShape[0]
            )
              inShape = true;
              if (gridRange[0] === 30 || gridRange[0] === 32) { //Ullrid
                const offset = gridRange[0] === 30 ? 5 : 7;
                if (Math.abs(row - center + offset) + Math.abs(col - center) <= gridShape[0]) {
                  inShape = true;
                }
              }
            break;
          case 5:
            if (
              center - row > 1 &&
              center - row <= gridShape[0] &&
              col === center
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
              case 68: //Vepley
              case 38: //Lotta
                shape7 = [3, 5];
                break;
              case 69: //VepleyKey
                shape7 = [5, 3];
                break;
              case 78: //Littara
                shape7 = [3, 8];
                break;
              case 80: //LittaraLv2
                shape7 = [3, 8];
                break;
            }
            if (
              center - row > 0 &&
              center - row <= shape7[1] &&
              Math.abs(center - col) <= Math.floor(shape7[0] / 2)
            )
              inShape = true;
            if (gridShape[0] === 78) { //Littara
              if (Math.abs(center - row) <= Math.floor(5 / 2)) inShape = false;
            }
            break;
        }

        if (inShape && !(row === center && col === center)) {
          fillColor = SHAPE_COLOR;
        }

        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fillRect(
            col * CELL_SIZE + CELL_GAP,
            row * CELL_SIZE + CELL_GAP,
            CELL_SIZE - CELL_GAP * 2,
            CELL_SIZE - CELL_GAP * 2
          );
        }
      }
    }
  }, [range, shape, shapeParam, skillRange]);

  return (
    <div ref={containerRef} className="inline-block aspect-square">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default SkillGrid;
