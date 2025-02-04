import { useState } from "react";
import { Chr, Skill, Skin } from "../types";
import SkillCard from "../components/SkillCard";
import {
  Box,
  Typography,
  IconButton,
  Slide,
  Grid2,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
} from "@mui/material";
import Tables from "../data/TableLoader";
import CloseIcon from "@mui/icons-material/Close";

interface CharacterOverlayProps {
  open: boolean;
  onClose: () => void;
  character?: Chr;
}

//custom HoverInfo Tooltip
const HoverInfo = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    enterDelay={500}
    leaveDelay={100}
  />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: "0.75rem",
    padding: "8px",
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
    {
      margin: "0px",
    },
}));

const CharacterOverlay: React.FC<CharacterOverlayProps> = ({
  open,
  onClose,
  character,
}) => {
  if (!character) {
    return <Typography variant="h6">404</Typography>;
  }
  //skins
  const skinData = character.skins.map((skinId) => {
    const skin = Tables.ClothesData[skinId];
    if (!skin) throw new Error(`Skin with ID ${skinId} not found`);
    return {
      ...skin,
    };
  });
  const [currentSkin, setCurrentSkin] = useState<Skin>(skinData[0]);
  const displayedImage = `dolls/Avatar_Whole_${currentSkin.code}.png`;
  const handleSkinChange = (
    _event: React.MouseEvent<HTMLElement>,
    updatedCurrentSkinId: number | null
  ) => {
    if (updatedCurrentSkinId) {
      const updatedSkin = skinData.find(
        (skin) => skin.id === updatedCurrentSkinId
      );
      if (updatedSkin) {
        setCurrentSkin(updatedSkin);
      }
    }
  };

  //skills
  const vertebraeIds = [...Array.from({ length: 7 }, (_, i) => i + 1)].map(
    (x) => character.id * 100 + x
  );

  const loadSkill = (skillId: number) => {
    const [data, display] = [
      Tables.BattleSkillData[skillId],
      Tables.BattleSkillDisplayData[skillId],
    ];
    if (!data || !display)
      throw new Error(`Skill with ID ${skillId} not found`);
    return {
      ...data,
      ...display,
      range: display.rangeDisplayParam || data.skillRangeParam,
      shape: display.shapeDisplay || data.shape,
      shapeParam: display.shapeDisplayParam || data.shapeParam,
    };
  };
  const skillIds = vertebraeIds.map(
    (vertId) => Tables.GunGradeData[vertId].abbr
  );
  const baseSkills = [character.skillNormalAttack]
    .concat(skillIds[0])
    .map((skillId: number) => loadSkill(skillId));
  //const allSkills = skillIds.slice(1).flat().map((skillId: number) => loadSkill(skillId));
  const reorderedSkills = [
    baseSkills[0],
    baseSkills[2],
    baseSkills[3],
    baseSkills[1],
    baseSkills[4],
  ];
  const [skills, _setSkills] = useState<Skill[]>(reorderedSkills);
  const [currentSkill, setCurrentSkill] = useState<Skill>(baseSkills[0]);

  const handleSkillChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSkillIndex: number | null
  ) => {
    if (newSkillIndex !== null) {
      setCurrentSkill(skills[newSkillIndex]);
    }
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "background.default",
          zIndex: 1300,
          p: 4,
          overflow: "auto",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>
        <Grid2 container spacing={2} sx={{ border: "1px solid red" }}>
          {/* Character Info */}
          <Grid2
            size={{ xs: 12, sm: 8, md: 6 }}
            sx={{ border: "1px solid orange" }}
          >
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6">{character.name}</Typography>
              {/* Stats Info */}
              <Grid2 container spacing={1} sx={{ border: "1px solid yellow" }}>
                <Grid2 size={{ xs: 2 }} sx={{ border: "1px solid green" }}>
                  <Typography>Class:</Typography>
                </Grid2>
                <Grid2 size={{ xs: 4 }} sx={{ border: "1px solid green" }}>
                  <HoverInfo title={Tables.GunDutyData[character.duty].name}>
                    <Box
                      component="img"
                      src={`/icons/${
                        Tables.GunDutyData[character.duty].icon
                      }_W.png`}
                      alt={`${Tables.GunDutyData[character.duty].name} icon`}
                      sx={{ verticalAlign: "middle", height: "4rem" }}
                    />
                  </HoverInfo>
                </Grid2>
                <Grid2 size={{ xs: 2 }}>
                  <Typography>Weapon:</Typography>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <HoverInfo
                    title={
                      Tables.GunWeaponTypeData[character.weaponType]["name"]
                    }
                  >
                    <Box
                      component="img"
                      src={`/icons/${
                        Tables.GunWeaponTypeData[character.weaponType][
                          "skinIcon"
                        ]
                      }.png`}
                      alt={`${
                        Tables.GunWeaponTypeData[character.weaponType]["name"]
                      } icon`}
                      sx={{ verticalAlign: "middle", height: "4rem" }}
                    />
                  </HoverInfo>
                </Grid2>
                <Grid2 size={{ xs: 2 }}>
                  <Typography>Element:</Typography>
                </Grid2>
                {/* <Grid2 size={{ xs: 4 }}>
                  {character.element && (
                    <HoverInfo title={character.element}>
                      <Box
                        component="img"
                        src={elementIcons[character.element]}
                        alt={`${character.element} icon`}
                        sx={{ verticalAlign: "middle", height: "4rem" }}
                      />
                    </HoverInfo>
                  )}
                </Grid2> */}
                <Grid2 size={{ xs: 2 }}>
                  <Typography sx={{ verticalAlign: "middle" }}>
                    Weakness:
                  </Typography>
                </Grid2>
                {/* <Grid2 size={{ xs: 4 }}>
                  <Stack direction="row">
                    <HoverInfo title={character.weakness[0]}>
                      <Box
                        component="img"
                        src={ammoIcons[character.weakness[0]]}
                        alt={`${character.weakness[0]} icon`}
                        sx={{ verticalAlign: "middle", height: "4rem" }}
                      />
                    </HoverInfo>
                    <HoverInfo title={character.weakness[1]}>
                      <Box
                        component="img"
                        src={elementIcons[character.weakness[1]]}
                        alt={`${character.weakness[1]} icon`}
                        sx={{ verticalAlign: "middle", height: "4rem" }}
                      />
                    </HoverInfo>
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Stack direction="row">
                    <Box
                      component="img"
                      src="./icons/Icon_Hp_64.png"
                      sx={{ verticalAlign: "middle", height: "1.5rem" }}
                    />
                    <Typography>HP: {character.hp}</Typography>
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Stack direction="row">
                    <Box
                      component="img"
                      src="./icons/Icon_Pow_64.png"
                      sx={{ verticalAlign: "middle", height: "1.5rem" }}
                    />
                    <Typography>ATK: {character.atk}</Typography>
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Stack direction="row">
                    <Box
                      component="img"
                      src="./icons/Icon_Armor_64.png"
                      sx={{ verticalAlign: "middle", height: "1.5rem" }}
                    />
                    <Typography>DEF: {character.def}</Typography>
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Stack direction="row">
                    <Box
                      component="img"
                      src="./icons/Icon_Will_64.png"
                      sx={{ verticalAlign: "middle", height: "1.5rem" }}
                    />
                    <Typography>Stability: {character.stability}</Typography>
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Stack direction="row">
                    <Box
                      component="img"
                      src="./icons/Icon_Max_Ap_64.png"
                      sx={{ verticalAlign: "middle", height: "1.5rem" }}
                    />
                    <Typography>Move: {character.move}</Typography>
                  </Stack>
                </Grid2> */}
              </Grid2>
              {/* Skills Info */}
              <Grid2 container spacing={1} sx={{ border: "1px solid blue" }}>
                <ToggleButtonGroup
                  value={currentSkill}
                  exclusive
                  onChange={handleSkillChange}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  {skills.map((skill, index) => (
                    <ToggleButton
                      key={skill.id}
                      value={index}
                      sx={{ p: "5px", typography: "subtitle2" }}
                    >
                      {`Skill ${index + 1}`}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <SkillCard skill={currentSkill} />
              </Grid2>
            </Box>
          </Grid2>

          {/* Character Image */}
          <Grid2
            size={{ xs: 12, sm: 4, md: 6 }}
            sx={{ border: "1px solid purple" }}
          >
            <Box sx={{ padding: 2 }}>
              {character.skins.length > 1 ? (
                <ToggleButtonGroup
                  value={currentSkin.id}
                  onChange={handleSkinChange}
                  size="small"
                  exclusive
                >
                  {skinData.map((skin) => (
                    <ToggleButton
                      key={skin.id}
                      value={skin.id}
                      sx={{ p: "5px", textTransform: "none" }}
                    >
                      {skin.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              ) : null}
            </Box>
            <Box
              component="img"
              src={displayedImage}
              alt={character.name}
              sx={{
                padding: 2,
                mx: "auto",
                display: "block",
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
              }}
            ></Box>
          </Grid2>
        </Grid2>
      </Box>
    </Slide>
  );
};

export default CharacterOverlay;
