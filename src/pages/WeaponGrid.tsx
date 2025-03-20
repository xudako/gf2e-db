import React, { useState } from "react";
import { Wpn } from "../types";
import { weapons, weaponTypes } from "../data/data";
import { useNavigate } from "react-router-dom";
import ToggleButton from "../components/ToggleButton";

const WeaponGrid: React.FC = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<Wpn | null>(null);
  //const [filterRegion, setFilterRegion] = useState<number>(-1);
  const [filterRarity, setFilterRarity] = useState<number>(-1);
  const [filterWeapon, setFilterWeapon] = useState<number>(-1);
  const navigate = useNavigate();

  const handleWeaponSelect = (weapon: Wpn) => {
    setSelectedWeapon(weapon);
    navigate(`/weapons/${weapon.name.replace(" ", "_")}`);
  };

  // const handleRegionFilter = (
  //   _event: React.MouseEvent<HTMLElement>,
  //   newRegion: number | null
  // ) => {
  //   newRegion === null ? setFilterRegion(-1) : setFilterRegion(newRegion);
  // };

  const handleRarityFilter = (newRarity: number) => {
    setFilterRarity(filterRarity === newRarity ? -1 : newRarity);
  };

  const handleWeaponFilter = (newWeapon: number) => {
    setFilterWeapon(filterWeapon === newWeapon ? -1 : newWeapon);
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
    const weaponMatch = filterWeapon === -1 || filterWeapon === weapon.type;

    return (
      rarityMatch && weaponMatch
    );
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
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
        <div className="flex bg-primary-main border border-filter-button-border">
        <ToggleButton selected={filterRarity === 3} onClick={() => handleRarityFilter(3)}>
            R
          </ToggleButton>
          <ToggleButton selected={filterRarity === 4} onClick={() => handleRarityFilter(4)}>
            SR
          </ToggleButton>
          <ToggleButton selected={filterRarity === 5} onClick={() => handleRarityFilter(5)}>
            SSR
          </ToggleButton>
        </div>
        <div className="flex bg-primary-main border border-filter-button-border">
          {weaponTypes.map((weapon) => (
            <ToggleButton
              key={weapon.id}
              selected={filterWeapon === weapon.id}
              onClick={() => handleWeaponFilter(weapon.id)}
            >
              {weapon.abbr}
            </ToggleButton>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setFilterRarity(-1);
            setFilterWeapon(-1);
          }}
          className="px-2 py-1 min-w-[6rem] text-sm border border-filter-button-border transition-colors bg-primary-main text-primary-text hover:bg-primary-light"
        >
          Reset
        </button>
      </div>

      {/* Weapon Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {filteredWeapons.map((weapon) => (
          <div
          key={weapon.name}
          onClick={() => handleWeaponSelect(weapon)}
          className={`p-4 transition-colors cursor-pointer
            ${selectedWeapon?.name === weapon.name ? "bg-primary-light" : ""}
            hover:bg-secondary-main hover:text-white`}
        >
            <img
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
              className={`w-full aspect-square object-cover rounded-lg 
                ${weapon.rank === 5 ? "bg-rarity-ssr" : weapon.rank === 4 ? "bg-rarity-sr" : "bg-rarity-r"}`}
            />
            <div className="mt-2 text-center font-medium">{weapon.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeaponGrid;