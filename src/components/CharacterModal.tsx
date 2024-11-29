import React, { useState } from "react";
import { Chr } from '../types';
import { elementIcons, classIcons, ammoIcons, weaponTypesFull } from '../utils/mappings';
import { Typography, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

interface ModalProps {
  character: Chr | null;
  onClose: () => void;
}

const CharacterModal: React.FC<ModalProps> = ({ character, onClose }) => {
  const [currentSkin, setCurrentSkin] = useState<string | null>(null);

  if (!character) return null;

  const handleCurrentSkinChange = (_event: React.MouseEvent<HTMLElement>, updatedCurrentSkin: string | null) => {
    setCurrentSkin(updatedCurrentSkin)
  }

  const displayedImage = currentSkin
    ? `dolls/Avatar_Whole_${character.internalName ?? character.name}${character.rarity}${currentSkin}.png`
    : `/dolls/Avatar_Whole_${character.internalName ?? character.name}${character.rarity}.png`;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="modal-body">
          <div className="image-container">
            <img
              src={displayedImage}
              alt={character.name}
              className="modal-image"
            />
          </div>

          <div className="info-container">
            <Typography variant="h2">{character.name}</Typography>
            <Typography>Class:
              <img
                src={classIcons[character.class]}
                alt={`${character.class} icon`}
                className="class-icon icons"
              />
            </Typography>
            <Typography>Weapon:
              <img
                src={ammoIcons[character.weapon]}
                alt={`${character.weapon} icon`}
                className="ammo-icon icons"
              />{character.weapon}
            </Typography>
            <Typography>Element:
              {character.element && (
                <img
                  src={elementIcons[character.element]}
                  alt={`${character.element} icon`}
                  className="element-icon icons"
                />
              )}
            </Typography>
            <Typography variant="h2">Skills</Typography>
            <img
              src={`/skills/Skill_Attack_${character.basicAttack ?? weaponTypesFull[character.weapon]}.png`}
              alt={"Basic Attack"}
              className="skills"
            />
            <img
              src={`/skills/Skill_${character.internalName ?? character.name}${character.rarity}_Active_1.png`}
              alt={"Skill 1"}
              className="skills"
            />
            <img
              src={`/skills/Skill_${character.internalName ?? character.name}${character.rarity}_Active_2.png`}
              alt={"Skill 2"}
              className="skills"
            />
            <img
              src={`/skills/Skill_${character.internalName ?? character.name}${character.rarity}_Active_3.png`}
              alt={"Skill 3"}
              className="skills"
            />
            <img
              src={`/skills/Skill_${character.internalName ?? character.name}${character.rarity}_Passive_4.png`}
              alt={"Skill 4"}
              className="skills"
            />
          </div>

          {/* Skin Buttons */}
          {character.skinID?.length ? (
            <Stack direction='row'>
              <Typography>Select a skin:</Typography>
              <ToggleButtonGroup value={currentSkin} onChange={handleCurrentSkinChange} size="small" exclusive>
                <ToggleButton
                  value="Original"
                  onClick={() => setCurrentSkin(null)}
                  className={`skin-button`}
                >
                </ToggleButton>
                {character.skinID.map(ID => (
                  <ToggleButton
                    value={ID}
                    onClick={() => setCurrentSkin(ID)}
                    className={`skin-button ${currentSkin === ID ? "active" : ""}`}
                  >
                    {ID}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          ) : (
            <Typography>No additional skins available.</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
