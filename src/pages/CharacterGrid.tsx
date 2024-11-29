import React, { useEffect, useState } from "react";
import CharacterModal from "../components/CharacterModal";
import { Chr } from "../types";
import { Box, Grid2 } from "@mui/material";

const CharacterGrid: React.FC = () => {
  const [characters, setCharacters] = useState<Chr[]>([]);

  useEffect(() => {
    fetch("data/characters.json")
      .then((response) => response.json())
      .then((data) => setCharacters(data));
  }, []);

  const [selectedCharacter, setSelectedCharacter] = useState<Chr | null>(null);

  const closeModal = () => {
    setSelectedCharacter(null);
  };

  return (
    <Grid2 container spacing={2}>
      {characters.map((character) => (
        <Grid2
          size={{ xs: 3, lg: 2, xl: 1 }}
          key={character.name}
          className="character-card"
          onClick={() => setSelectedCharacter(character)}
        >
          <Box
            component="img"
            src={`/dolls/Avatar_Bust_${
              character.internalName ?? character.name
            }${character.rarity}.png`}
            alt={character.name}
            onError={(e) => (e.currentTarget.src = "/images/default.png")}
            sx={{
              maxHeight: "400",
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: "8",
            }}
          />
          <Box
            sx={{
              position: "relative",
              bottom: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              px: "10",
              textAlign: "center",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {character.name}
          </Box>
        </Grid2>
      ))}
      {selectedCharacter && (
        <CharacterModal character={selectedCharacter} onClose={closeModal} />
      )}
    </Grid2>
  );
};

export default CharacterGrid;
