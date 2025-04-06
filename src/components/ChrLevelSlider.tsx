import React, { useState, useEffect } from 'react';

interface LevelSliderProps {
  initialLevel?: number;
  initialRange?: number;
  onChange?: (level: number, formattedLabel: string) => void;
}

interface LevelRange {
  level: number;
  maxLevel: number;
}

export const LevelSlider: React.FC<LevelSliderProps> = ({
  initialLevel = 60,
  initialRange = 60,
  onChange,
}) => {
  // Track both the level and the current range separately
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentRange, setCurrentRange] = useState(initialRange);
  const [sliderValue, setSliderValue] = useState(0); // A value from 0 to totalSteps
  const [formattedLabel, setFormattedLabel] = useState('');
  
  // Define all the ranges
  const ranges: LevelRange[] = [
    { level: 1, maxLevel: 20 },
    { level: 20, maxLevel: 30 },
    { level: 30, maxLevel: 40 },
    { level: 40, maxLevel: 50 },
    { level: 50, maxLevel: 60 }
  ];
  
  // Create mapping from slider position to level and range
  const createSliderMapping = (): { level: number; range: number }[] => {
    const mapping: { level: number; range: number }[] = [];
    
    ranges.forEach((range, rangeIndex) => {
      // Regular steps within the range
      for (let lvl = range.level; lvl <= range.maxLevel; lvl++) {
        mapping.push({ level: lvl, range: range.maxLevel });
      }
      
      // Add transition step if it's not the last range
      if (rangeIndex < ranges.length - 1) {
        const nextRange = ranges[rangeIndex + 1];
        mapping.push({ level: nextRange.level, range: nextRange.maxLevel });
      }
    });
    
    return mapping;
  };
  
  const sliderMapping = createSliderMapping();
  
  // Convert level and range to slider position
  useEffect(() => {
    // Find the slider position for the current level and range
    const position = sliderMapping.findIndex(
      item => item.level === currentLevel && item.range === currentRange
    );
    
    if (position !== -1) {
      setSliderValue(position);
    } else {
      // Fallback if not found
      setSliderValue(0);
    }
    
    // Update formatted label
    setFormattedLabel(`${currentLevel}/${currentRange}`);
    
    // Call onChange if provided
    if (onChange) {
      onChange(currentLevel, `${currentLevel}/${currentRange}`);
    }
  }, [currentLevel, currentRange]);
  
  // Handle slider change
  const handleSliderChange = (position: number) => {
    const mappingItem = sliderMapping[position];
    if (mappingItem) {
      setCurrentLevel(mappingItem.level);
      setCurrentRange(mappingItem.range);
    }
  };
  
  // Calculate positions for the visual marks as percentages
  const markPositions = [
    { value: 1, position: '2.125%' },
    { value: 20, position: '30.875%' },
    { value: 30, position: '48%' },
    { value: 40, position: '65.125%' },
    { value: 50, position: '82.25%' },
    { value: 60, position: '97.875%' }
  ];

  return (
    <div className="col-span-6">
      <div className="flex justify-between">
        <span>Level:</span>
        <span className="font-medium">{formattedLabel}</span>
      </div>
      <div className="mt-2 max-w-sm">
        <input
          type="range"
          min="0"
          max={sliderMapping.length - 1}
          value={sliderValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full"
          step="1"
        />
        <div className="relative h-6">
          {markPositions.map((mark) => (
            <div 
              key={mark.value} 
              className="absolute top-0 text-xs text-gray-500 transform -translate-x-1/2"
              style={{ left: mark.position }}
            >
              {mark.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};