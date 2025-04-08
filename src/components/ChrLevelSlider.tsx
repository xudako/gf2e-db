import React, { useState, useEffect } from 'react';

interface LevelSliderProps {
  currentLevel: number;
  currentRange: number;
  onLevelChange: (level: number) => void;
  onRangeChange: (range: number) => void;
}

interface LevelRange {
  level: number;
  maxLevel: number;
}

const LevelSlider: React.FC<LevelSliderProps> = ({
  currentLevel,
  currentRange,
  onLevelChange,
  onRangeChange,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [formattedLabel, setFormattedLabel] = useState('');

  const ranges: LevelRange[] = [
    { level: 1, maxLevel: 20 },
    { level: 20, maxLevel: 30 },
    { level: 30, maxLevel: 40 },
    { level: 40, maxLevel: 50 },
    { level: 50, maxLevel: 60 },
  ];

  const createSliderMapping = (): { level: number; range: number }[] => {
    const mapping: { level: number; range: number }[] = [];

    ranges.forEach((range, rangeIndex) => {
      for (let lvl = range.level; lvl <= range.maxLevel; lvl++) {
        mapping.push({ level: lvl, range: range.maxLevel });
      }

      if (rangeIndex < ranges.length - 1) {
        const nextRange = ranges[rangeIndex + 1];
        mapping.push({ level: nextRange.level, range: nextRange.maxLevel });
      }
    });

    return mapping;
  };

  const sliderMapping = createSliderMapping();

  useEffect(() => {
    const position = sliderMapping.findIndex(
      (item) => item.level === currentLevel && item.range === currentRange
    );

    if (position !== -1) {
      setSliderValue(position);
    }

    setFormattedLabel(`${currentLevel}/${currentRange}`);
  }, [currentLevel, currentRange]);

  const handleSliderChange = (position: number) => {
    const mappingItem = sliderMapping[position];
    if (mappingItem) {
      onLevelChange(mappingItem.level);
      onRangeChange(mappingItem.range);
    }
  };

  const markPositions = [
    { value: 1, position: '2.5%' },
    { value: 20, position: '31.125%' },
    { value: 30, position: '48%' },
    { value: 40, position: '64.875%' },
    { value: 50, position: '81.75%' },
    { value: 60, position: '97.5%' },
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

export default LevelSlider;
