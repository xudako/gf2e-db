import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

const getRandomBackground = () => {
  const totalImages = 5;
  const randomIndex = Math.floor(Math.random() * totalImages) + 1;
  return `${import.meta.env.BASE_URL}bg/BG_None_Carriage_03_0${randomIndex}.png`;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    const randomImage = getRandomBackground();
    setBackgroundImage(randomImage);
  }, []);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, p: 2, flex: 1 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
