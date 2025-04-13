import React, { useEffect, useState } from 'react';
import { asset } from '../utils/utils';
import Header from './Header';
import Footer from './Footer';

const getRandomBackground = () => {
  const totalImages = 5;
  const randomIndex = Math.floor(Math.random() * totalImages) + 1;
  return asset(`bg/BG_None_Carriage_03_0${randomIndex}.png`);
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    const randomImage = getRandomBackground();
    setBackgroundImage(randomImage);
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header />
      <main className="flex-1 container mx-auto px-4 mt-8 lg:max-w-7xl">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
