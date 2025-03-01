import React, { useState, useEffect } from "react";
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
  Slider,
  SliderProps,
  Stack,
} from "@mui/material";
import Tables from "../data/TableLoader";
import CloseIcon from "@mui/icons-material/Close";

interface CharacterOverlayProps {
  open: boolean;
  onClose: () => void;
  character?: Chr;
}

type SkillTypeId = "01" | "05" | "07" | "04" | "08";

interface SkillType {
  id: SkillTypeId;
  name: string;
}

const skillTypes: SkillType[] = [
  { id: "01", name: "Basic" },
  { id: "05", name: "Skill 1" },
  { id: "07", name: "Skill 2" },
  { id: "04", name: "Ultimate" },
  { id: "08", name: "Passive" },
];

interface SkillsByLevel {
  [level: string]: Skill;
}

interface SkillTree {
  [sType: string]: SkillsByLevel;
}

const ammoType = new Map([
  [1, 2],
  [2, 2],
  [3, 8],
  [4, 4],
  [5, 8],
  [6, 32],
  [7, 16],
]);

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

const levelMarks = [
  { value: 1, label: "1" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: 50, label: "50" },
  { value: 60, label: "60" },
];

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
  const displayedImage = `${import.meta.env.BASE_URL}dolls/Avatar_Whole_${
    currentSkin.code
  }.png`;
  const handleSkinChange = (
    _event: React.MouseEvent<HTMLElement>,
    newCurrentSkinId: number | null
  ) => {
    if (newCurrentSkinId) {
      const newSkin = skinData.find((skin) => skin.id === newCurrentSkinId);
      if (newSkin) {
        setCurrentSkin(newSkin);
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
      weaponTag:
        data.weaponTag == 1
          ? ammoType.get(character.weaponType)
          : data.weaponTag,
    };
  };
  const skillIds = vertebraeIds.map(
    (vertId) => Tables.GunGradeData[vertId].abbr
  );

  const allSkills: SkillTree = {};

  [character.skillNormalAttack].concat(skillIds.flat()).forEach((id) => {
    const idString = id.toString();
    const type = idString.substring(4, 6);
    const level = idString.substring(6, 8);

    if (!allSkills[type]) {
      allSkills[type] = {};
    }

    allSkills[type][level] = loadSkill(id);
  });

  const [currentSkillType, setCurrentSkillType] = useState<SkillTypeId>(
    skillTypes[0].id
  );
  const [currentSkillLevels, setCurrentSkillLevels] = useState<
    Map<SkillTypeId, string>
  >(new Map(skillTypes.map((type) => [type.id, "01"])));
  const [currentSkillLevel, setCurrentSkillLevel] = useState<string>("01");
  const [currentSkill, setCurrentSkill] = useState<Skill>(
    allSkills["01"]["01"]
  );
  //console.log(currentSkillLevels, currentSkillLevel);

  useEffect(() => {
    setCurrentSkillLevels((prevLevels) =>
      new Map(prevLevels).set(currentSkillType, currentSkillLevel)
    );
  }, [currentSkillLevel]);

  useEffect(() => {
    setCurrentSkillLevel(currentSkillLevels.get(currentSkillType) ?? "01");
  }, [currentSkillType]);

  useEffect(() => {
    const level = currentSkillLevels.get(currentSkillType);
    if (
      currentSkillType &&
      currentSkillLevels &&
      allSkills[currentSkillType] &&
      level &&
      allSkills[currentSkillType][level]
    )
      setCurrentSkill(allSkills[currentSkillType][level]);
  }, [currentSkillType, currentSkillLevels]);

  const handleSkillTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSkillTypeId: SkillTypeId | null
  ) => {
    if (newSkillTypeId !== null) {
      setCurrentSkillType(newSkillTypeId);
    }
  };

  const getLevels = (skillType: string): string[] => {
    const levels = allSkills[skillType]
      ? Object.keys(allSkills[skillType]).sort()
      : [];
    return levels;
  };

  const handleSkillLevelChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLevel: string
  ) => {
    setCurrentSkillLevel(newLevel);
  };

  //level and stats
  const [currentLevel, setCurrentLevel] = useState<number>(60);

  const handleLevelChange: SliderProps["onChange"] = (
    _event: Event,
    newLevel: number | number[]
  ) => {
    setCurrentLevel(typeof newLevel === "number" ? newLevel : newLevel[0]);
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
        <Grid2 container spacing={2}>
          {/* Character Info */}
          <Grid2 size={{ xs: 12, sm: 8, md: 6 }}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h2">{character.name}</Typography>
              {/* Stats Info */}
              <Grid2 container spacing={1} sx={{mt: 2, border: "1px solid blue"}}>
                <Grid2 size={{ xs: 2 }}>
                  <Typography>Class:</Typography>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <HoverInfo title={Tables.GunDutyData[character.duty].name}>
                    <Box
                      component="img"
                      src={`${import.meta.env.BASE_URL}icons/${
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
                      src={`${import.meta.env.BASE_URL}icons/${
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
                <Grid2 size={{ xs: 4 }}>
                  <HoverInfo
                    title={
                      Tables.LanguageElementData[character.element]["name"]
                    }
                  >
                    <Box
                      component="img"
                      src={`${import.meta.env.BASE_URL}icons/${
                        Tables.LanguageElementData[character.element]["icon"]
                      }_S.png`}
                      alt={`${
                        Tables.LanguageElementData[character.element]["name"]
                      } icon`}
                      sx={{ verticalAlign: "middle", height: "4rem" }}
                    />
                  </HoverInfo>
                </Grid2>
                <Grid2 size={{ xs: 2 }}>
                  <Typography sx={{ verticalAlign: "middle" }}>
                    Weakness:
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Stack direction="row">
                    <HoverInfo
                      title={Tables.WeaponTagData[character.weak[0]]["name"]}
                    >
                      <Box
                        component="img"
                        src={`${import.meta.env.BASE_URL}icons/${
                          Tables.WeaponTagData[character.weak[0]]["icon"]
                        }_S.png`}
                        alt={`${
                          Tables.WeaponTagData[character.weak[0]]["name"]
                        } icon`}
                        sx={{ verticalAlign: "middle", height: "4rem" }}
                      />
                    </HoverInfo>
                    <HoverInfo
                      title={
                        Tables.LanguageElementData[character.weak[1]]["name"]
                      }
                    >
                      <Box
                        component="img"
                        src={`${import.meta.env.BASE_URL}icons/${
                          Tables.LanguageElementData[character.weak[1]]["icon"]
                        }_S.png`}
                        alt={`${
                          Tables.LanguageElementData[character.weak[1]]["name"]
                        } icon`}
                        sx={{ verticalAlign: "middle", height: "4rem" }}
                      />
                    </HoverInfo>
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Typography>Stats:</Typography>
                </Grid2>
                {/* <Grid2 size={{ xs: 4 }}>
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
                <Grid2 size={{ xs: 6 }}>
                  <Box sx={{ width: 300 }}>
                    <Typography>Level:</Typography>
                    <Slider
                      value={currentLevel}
                      step={null}
                      marks={levelMarks}
                      min={1}
                      max={60}
                      onChange={handleLevelChange}
                    />{" "}
                  </Box>
                </Grid2>
              </Grid2>

              {/* Skills Info */}
              <Grid2 container spacing={1} sx={{mt: 2}}>
                <ToggleButtonGroup
                  value={currentSkillType}
                  exclusive
                  onChange={handleSkillTypeChange}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  {skillTypes.map((skillType) => (
                    <ToggleButton
                      key={skillType.id}
                      value={skillType.id}
                      sx={{
                        p: "5px",
                        typography: "subtitle2",
                        minWidth: "6rem",
                      }}
                    >
                      {skillType.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {currentSkillType && getLevels(currentSkillType).length > 1 && (
                  <ToggleButtonGroup
                    value={currentSkillLevel}
                    exclusive
                    onChange={handleSkillLevelChange}
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {getLevels(currentSkillType).map((level) => (
                      <ToggleButton
                        key={level}
                        value={level}
                        sx={{
                          p: "5px",
                          typography: "subtitle2",
                          minWidth: "6rem",
                        }}
                      >
                        {level}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                )}
                <SkillCard skill={currentSkill} />
              </Grid2>
            </Box>
          </Grid2>

          {/* Character Image */}
          <Grid2 size={{ xs: 12, sm: 4, md: 6 }}>
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
