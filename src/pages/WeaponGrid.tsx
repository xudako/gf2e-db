import React, { useState } from "react";
import { Wpn } from "../types";
import { weapons, weaponTypes } from "../data/data";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid2,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "@mui/material";

const WeaponGrid: React.FC = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<Wpn | null>(null);
  //const [filterRegion, setFilterRegion] = useState<number>(-1);
  const [filterRarity, setFilterRarity] = useState<number>(-1);
  const [filterType, setFilterType] = useState<number>(-1);
  const navigate = useNavigate();

  const handleWeaponSelect = (weapon: Wpn) => {
    setSelectedWeapon(weapon);
    navigate(`/weapons/${weapon.name}`);
  };

  // const handleRegionFilter = (
  //   _event: React.MouseEvent<HTMLElement>,
  //   newRegion: number | null
  // ) => {
  //   newRegion === null ? setFilterRegion(-1) : setFilterRegion(newRegion);
  // };

  const handleRarityFilter = (
    _event: React.MouseEvent<HTMLElement>,
    newRarity: number | null
  ) => {
    newRarity === null ? setFilterRarity(-1) : setFilterRarity(newRarity);
  };

  const handleTypeFilter = (
    _event: React.MouseEvent<HTMLElement>,
    newType: number | null
  ) => {
    newType === null ? setFilterType(-1) : setFilterType(newType);
  };

  const sortedWeapons = weapons.sort((a, b) => {
    if (a.rank != b.rank) {
      return b.rank - a.rank;
    }
    return a.name.localeCompare(b.name);
  });

  const filteredWeapons = sortedWeapons.filter((weapon) => {
    //const regionMatch = filterRegion === -1 || filterRegion === weapon.region;
    const rarityMatch = filterRarity === -1 || filterRarity === weapon.rank;
    const typeMatch = filterType === -1 || filterType === weapon.type;

    return (
      rarityMatch && typeMatch
    );
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: 2,
        }}
      >
        {/* <ToggleButtonGroup //Region Filter
          value={filterRegion}
          exclusive
          onChange={handleRegionFilter}
          size="small"
          sx={{
            mb: 2,
            bgcolor: "primary.main",
            border: "1px solid",
            borderColor: "divider",
            "& .MuiToggleButton-root": {
              color: "grey.300",
              "&.Mui-selected": {
                color: "secondary.main",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            },
          }}
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
        </ToggleButtonGroup> */}
        <ToggleButtonGroup //Rarity Filter
          value={filterRarity}
          exclusive
          onChange={handleRarityFilter}
          size="small"
          sx={{
            mb: 2,
            bgcolor: "primary.main",
            border: "1px solid",
            borderColor: "divider",
            "& .MuiToggleButton-root": {
              color: "grey.300",
              "&.Mui-selected": {
                color: "secondary.main",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            },
          }}
        >
          <ToggleButton
            key={3}
            value={3}
            sx={{
              p: "5px",
              typography: "subtitle2",
              minWidth: "4rem",
            }}
          >
            R
          </ToggleButton>
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
        <ToggleButtonGroup //Type Filter
          value={filterType}
          exclusive
          onChange={handleTypeFilter}
          size="small"
          sx={{
            mb: 2,
            bgcolor: "primary.main",
            border: "1px solid",
            borderColor: "divider",
            "& .MuiToggleButton-root": {
              color: "grey.300",
              "&.Mui-selected": {
                color: "secondary.main",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            },
          }}
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
        <Button
          onClick={() => {
            setFilterRarity(-1);
            setFilterType(-1);
          }}
          sx={{
            mb: 2,
            bgcolor: "primary.main",
            border: "1px solid",
            borderColor: "divider",
            p: "5px",
            typography: "subtitle2",
            minWidth: "6rem",
            color: "grey.300",
          }}
        >
          Reset
        </Button>
      </Box>
      <Grid2 container spacing={2} columns={8}>
        {filteredWeapons.map((weapon) => (
          <Grid2
            size={{ xs: 4, lg: 2, xl: 1 }}
            key={weapon.name}
            onClick={() => handleWeaponSelect(weapon)}
            sx={{
              p: 1,
              backgroundColor:
                selectedWeapon?.name === weapon.name
                  ? "primary.light"
                  : "transparent",
              "&:hover": { backgroundColor: "secondary.main", color: "white" },
            }}
          >
            <Box
              component="img"
              src={
                `${import.meta.env.BASE_URL}weapons/${
                      weapon.resCode
                    }_256.png`
              }
              alt={weapon.name}
              onError={(e) =>
                (e.currentTarget.src = `${
                  import.meta.env.BASE_URL
                }images/default.png`)
              }
              sx={{
                bgcolor:
                  weapon.rank === 5 ? "raritySSR.main" : weapon.rank === 4 ? "raritySR.main" : "rarityR.main",
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
              {weapon.name}
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}

export default WeaponGrid;