import React, { useEffect, useRef } from 'react';
import { Skill } from '../types';
import Tables from '../data/TableLoader.ts';

type GridProps = Pick<Skill, 'id' | 'range' | 'shape' | 'shapeParam' | 'skillRange'>;

const SkillGrid: React.FC<GridProps> = ({ id, range, shape, shapeParam, skillRange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (Tables.BattleSkillData[id]['subskillGroup']) {
    const shapeDisplaySkill =
      Tables.BattleSkillData[
        Number(Tables.BattleSkillData[id]['subskillGroup'].split(';')[0].slice(2))
      ];
    if (shapeDisplaySkill.shapeDisplay) {
      shape = shapeDisplaySkill.shape;
      shapeParam = shapeDisplaySkill.shapeParam;
      console.log(shapeDisplaySkill);
    }
  }

  const processInput = (input: string) => {
    const parts = input.split(',').map(Number);
    return parts.map((val) => (val % 100 ? val : val / 100));
  };
  const gridRange = processInput(range);
  const gridShape = processInput(shapeParam);

  console.log(id, gridRange, gridShape, skillRange, shape);

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
  let gridSize: number;
  if (shape === 7 || skillRange === 7) {
    if (shape === 7) {
      const shapeHeight = Tables.BattleShapeData[gridShape[0]].shape.split(';').length;
      gridSize = [9, 17, 21].find((val) => val >= shapeHeight) ?? 21;
    } else {
      const shapeHeight = Tables.BattleShapeData[gridRange[0]].shape.split(';').length;
      gridSize = [9, 17, 21].find((val) => val >= shapeHeight) ?? 21;
    }
  } else {
    gridSize =
      shape === 8 || skillRange === 8
        ? 21 : [9, 17, 21].find((val) => val > 2 * (gridRange[0] + gridShape[0])) ?? 21;
  }

  const RANGE_COLOR = '#6979d9'; // info color
  const SHAPE_COLOR = '#f26c1c'; // secondary.main color
  const BG_COLOR = '#dddddd';
  const CENTER_COLOR = '#ffffff';
  const CELL_GAP = 1; // Gap between cells in pixels
  const GRID_BG = '#999999'; // Default grid cell color

  const getShapeData = (shapeId: number) => {
    const shapeEntry = Tables.BattleShapeData[shapeId];
    if (!shapeEntry) return null;

    // Parse the shape string into a 2D array
    const rows = shapeEntry.shape
      .split(';')
      .map((row: string) => row.slice(1, -1).split(',').map(Number));

    // Calculate offset from center
    const [offsetX, offsetY] = shapeEntry.position.split(',').map(Number);

    return {
      rows,
      offsetX,
      offsetY,
    };
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    // Make canvas size match container size
    const size = container.clientWidth;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
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
            const rangeShape = getShapeData(gridRange[0]);
            if (rangeShape) {
              // Calculate the shape's dimensions
              const shapeHeight = rangeShape.rows.length;
              const shapeWidth = rangeShape.rows[0].length;

              // Calculate the center of the shape
              const shapeCenterX = Math.floor((shapeWidth - 1) / 2);
              const shapeCenterY = Math.floor(shapeHeight / 2);

              // Calculate the grid position relative to the shape's center
              const gridRow = row - center + shapeCenterY;
              const gridCol = col - center + shapeCenterX;

              // Check if the grid position is within the shape bounds
              if (
                gridRow >= 0 &&
                gridRow < shapeHeight &&
                gridCol >= 0 &&
                gridCol < shapeWidth &&
                rangeShape.rows[gridRow][gridCol] === 1
              ) {
                inRange = true;
              }
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
          case 10:
            if (!targetFlag && inRange && col === center) {
              targetFlag = true;
              inShape = true;
            }
            break;
          case 2:
            if (
              Math.abs(center - row - gridRange[0]) <= Math.floor(gridShape[0] / 2) &&
              Math.abs(center - col) <= Math.floor(gridShape[0] / 2)
            )
              inShape = true;
            if (gridShape[1]) {
              if (
                Math.abs(center - row - gridRange[0]) <= Math.floor(gridShape[1] / 2) &&
                Math.abs(center - col) <= Math.floor(gridShape[1] / 2)
              )
                inShape = false;
            }
            break;
          case 3:
            if (Math.abs(row - center + gridRange[0]) + Math.abs(col - center) <= gridShape[0])
              inShape = true;
            if (gridRange[0] === 30 || gridRange[0] === 32) {
              //Ullrid
              const offset = gridRange[0] === 30 ? 5 : 7;
              if (Math.abs(row - center + offset) + Math.abs(col - center) <= gridShape[0]) {
                inShape = true;
              }
            }
            break;
          case 5:
            if (center - row > 1 && center - row <= gridShape[0] && col === center) inShape = true;
            break;
          case 8:
            inShape = true;
            break;
          case 7:
            const shapeData = getShapeData(gridShape[0]);
            if (shapeData) {
              // Calculate the shape's dimensions
              const shapeHeight = shapeData.rows.length;
              const shapeWidth = shapeData.rows[0].length;

              // Calculate the center of the shape
              const shapeCenterX = shapeWidth - 1;
              const shapeCenterY = shapeHeight;

              // Calculate the grid position relative to the shape's center
              const gridRow = row - center + shapeCenterY + shapeData.offsetY;
              const gridCol = col - center + shapeCenterX + shapeData.offsetX;

              console.log(shapeParam);
              // Check if the grid position is within the shape bounds
              if (
                gridRow >= 0 &&
                gridRow < shapeHeight &&
                gridCol >= 0 &&
                gridCol < shapeWidth &&
                shapeData.rows[shapeHeight - gridRow - 1][gridCol] === 1
              ) {
                inShape = true;
              }
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
  }, [range, shape, shapeParam, skillRange, gridSize]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SkillGrid;
