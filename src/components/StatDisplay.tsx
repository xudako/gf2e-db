import React from 'react';

const StatDisplay: React.FC<{ img: string; stat: number | string }> = ({ img, stat }) => (
  <div className="col-span-1 flex flex-col items-center">
    <img src={`${import.meta.env.BASE_URL}icons/${img}_64.png`} className="w-12 h-12" />
    <span className="text-center mt-1">{stat}</span>
  </div>
);

export default StatDisplay;