import React, { useState } from "react";
import { Chr } from "../types";
import { characters } from "../data/data";
import { useNavigate } from "react-router-dom";
import { Box, Grid2 } from "@mui/material";

const CharacterGrid: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Chr | null>(null);
  const navigate = useNavigate();

  const handleCharacterSelect = (character: Chr) => {
    setSelectedCharacter(character);
    navigate(`/dolls/${character.name}`);
  };

  const sortedCharacters = characters.sort((a, b) => {
    if (a.rank != b.rank) {
      return b.rank - a.rank
    }
    return a.name.localeCompare(b.name)
  });

  return (
    <Box>
      <Grid2 container spacing={2}>
        {sortedCharacters.map((character) => (
          <Grid2
            size={{ xs: 3, lg: 2, xl: 1 }}
            key={character.name}
            onClick={() => handleCharacterSelect(character)}
            sx={{
              p: 1,
              backgroundColor:
                selectedCharacter?.name === character.name
                  ? "primary.light"
                  : "transparent",
              "&:hover": { backgroundColor: "secondary.main", color: "white" },
            }}
          >
            <Box
              component="img"
              src={`/dolls/Avatar_Head_${
                character.code}_Spine.png`}
              alt={character.name}
              onError={(e) => (e.currentTarget.src = "/images/default.png")}
              sx={{
                bgcolor:
                  character.rank === 5 ? "raritySSR.main" : "raritySR.main",
                maxHeight: "400",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: "8",
                cursor: "pointer",
                // add hover effect
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
                cursor: "pointer",
              }}
            >
              {character.name}
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default CharacterGrid;
