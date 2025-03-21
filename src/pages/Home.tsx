import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary-main mb-6">Welcome to GF2E-DB</h1>
      <p className="text-lg text-primary-main mb-4">
        Your comprehensive database for Girls' Frontline 2: Exilium
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-background-paper rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-primary-main mb-3">Dolls</h2>
          <p className="text-primary-main">Browse and compare all available dolls</p>
        </div>
        <div className="p-6 bg-background-paper rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-primary-main mb-3">Weapons</h2>
          <p className="text-primary-main">Explore weapon stats and details</p>
        </div>
        <div className="p-6 bg-background-paper rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-primary-main mb-3">Tools</h2>
          <p className="text-primary-main">Access helpful game calculators and guides</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
