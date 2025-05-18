import React, { useEffect, useState } from 'react';
import { asset } from '../utils/utils';
import Header from './Header';
import Footer from './Footer';
//import bgImages from '../bgImagesList.json';

const getRandomBackground = () => {
  const totalImages = 7;
  const randomIndex = Math.floor(Math.random() * totalImages) + 1;
  return asset(`bg/BG_None_Carriage_03_0${randomIndex}.png`);
  // if (!bgImages || bgImages.length === 0) {
  //   console.warn('No background images found');
  //   return '';
  // }
  // const randomIndex = Math.floor(Math.random() * bgImages.length);
  // return asset(`bg/${bgImages[randomIndex]}`);
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    const randomImage = getRandomBackground();
    setBackgroundImage(randomImage);
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header />
      <main className="flex-1 container mx-auto px-4 mt-8 lg:max-w-7xl">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
