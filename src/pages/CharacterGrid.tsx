import React, { useState } from "react";
import { Chr } from "../types";
import { characters, gunDuties, weaponTypes } from "../data/data";
import { useNavigate } from "react-router-dom";
import { Box, Grid2, ToggleButtonGroup, ToggleButton } from "@mui/material";

function stripCode(input: string): string {
  return input.replace(/ssr$/i, "").replace(/sr$/i, "");
}

const CharacterGrid: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Chr | null>(null);
  const [hoveredCharacter, setHoveredCharacter] = useState<Chr | null>(null);
  const [filterRegion, setFilterRegion] = useState<number>(-1);
  const [filterRarity, setFilterRarity] = useState<number>(-1);
  const [filterRole, setFilterRole] = useState<number>(-1);
  const [filterWeapon, setFilterWeapon] = useState<number>(-1);
  //const [filterElement, setFilterElement] = useState<number>(-1);
  const navigate = useNavigate();

  const handleCharacterSelect = (character: Chr) => {
    setSelectedCharacter(character);
    navigate(`/dolls/${character.name}`);
  };

  const handleRegionFilter = (
    _event: React.MouseEvent<HTMLElement>,
    newRegion: number | null
  ) => {
    newRegion === null ? setFilterRegion(-1) : setFilterRegion(newRegion);
  };

  const handleRarityFilter = (
    _event: React.MouseEvent<HTMLElement>,
    newRarity: number | null
  ) => {
    newRarity === null ? setFilterRarity(-1) : setFilterRarity(newRarity);
  };

  const handleRoleFilter = (
    _event: React.MouseEvent<HTMLElement>,
    newRole: number | null
  ) => {
    newRole === null ? setFilterRole(-1) : setFilterRole(newRole);
  };

  const handleWeaponFilter = (
    _event: React.MouseEvent<HTMLElement>,
    newWeapon: number | null
  ) => {
    newWeapon === null ? setFilterWeapon(-1) : setFilterWeapon(newWeapon);
  };

  const sortedCharacters = characters.sort((a, b) => {
    if (a.rank != b.rank) {
      return b.rank - a.rank;
    }
    return a.name.localeCompare(b.name);
  });

  const filteredCharacters = sortedCharacters.filter((character) => {
    const regionMatch = filterRegion === -1 || filterRegion === character.region;
    const rarityMatch = filterRarity === -1 || filterRarity === character.rank;
    const roleMatch = filterRole === -1 || filterRole === character.duty;
    const weaponMatch =
      filterWeapon === -1 || filterWeapon === character.weaponType;
    //const elementMatch = filterElement === -1 || filterElement === character.element;

    return regionMatch && rarityMatch && roleMatch && weaponMatch;
  });

  return (
    <Box>
      <ToggleButtonGroup //Region Filter
        value={filterRegion}
        exclusive
        onChange={handleRegionFilter}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton
          key={0}
          value={0}
          sx={{
            p: "5px",
            typography: "subtitle2",
            minWidth: "4rem",
          }}
        >
          CN
        </ToggleButton>
        <ToggleButton
          key={1}
          value={1}
          sx={{
            p: "5px",
            typography: "subtitle2",
            minWidth: "4rem",
          }}
        >
          EN
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup //Rarity Filter
        value={filterRarity}
        exclusive
        onChange={handleRarityFilter}
        size="small"
        sx={{ mb: 2 }}
      >
        {/* <ToggleButton
          key={-1}
          value={-1}
          sx={{
            p: "5px",
            typography: "subtitle2",
            minWidth: "6rem",
          }}
        >
          All
        </ToggleButton> */}
        <ToggleButton
          key={4}
          value={4}
          sx={{
            p: "5px",
            typography: "subtitle2",
            minWidth: "4rem",
          }}
        >
          SR
        </ToggleButton>
        <ToggleButton
          key={5}
          value={5}
          sx={{
            p: "5px",
            typography: "subtitle2",
            minWidth: "4rem",
          }}
        >
          SSR
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup //Role Filter
        value={filterRole}
        exclusive
        onChange={handleRoleFilter}
        size="small"
        sx={{ mb: 2 }}
      >
        {gunDuties.map((role) => (
          <ToggleButton
            key={role.id}
            value={role.id}
            sx={{
              p: "5px",
              typography: "subtitle2",
              minWidth: "4rem",
            }}
          >
            {role.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup //Weapon Filter
        value={filterWeapon}
        exclusive
        onChange={handleWeaponFilter}
        size="small"
        sx={{ mb: 2 }}
      >
        {weaponTypes.map((weapon) => (
          <ToggleButton
            key={weapon.id}
            value={weapon.id}
            sx={{
              p: "5px",
              typography: "subtitle2",
              minWidth: "4rem",
            }}
          >
            {weapon.abbr}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Grid2 container spacing={2}>
        {filteredCharacters.map((character) => (
          <Grid2
            size={{ xs: 3, lg: 2, xl: 1 }}
            key={character.name}
            onClick={() => handleCharacterSelect(character)}
            onMouseEnter={() => setHoveredCharacter(character)}
            onMouseLeave={() => setHoveredCharacter(null)}
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
              src={
                character == hoveredCharacter
                  ? `${
                      import.meta.env.BASE_URL
                    }dolls/Img_KittyCafe_Cat_${stripCode(character.code)}.png`
                  : `${import.meta.env.BASE_URL}dolls/Avatar_Head_${
                      character.code
                    }_Spine.png`
              }
              alt={character.name}
              onError={(e) =>
                (e.currentTarget.src = `${
                  import.meta.env.BASE_URL
                }images/default.png`)
              }
              sx={{
                bgcolor:
                  character.rank === 5 ? "raritySSR.main" : "raritySR.main",
                maxHeight: "400",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: "8",
                cursor: "pointer",
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
