import {
  Box,
  Grid2,
  Typography,
  Chip,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import { Skill, Buff } from "../types";
import SkillGrid from "./SkillGrid";
import Tables from "../data/TableLoader";

interface RichTextProps {
  content: string | undefined;
  descriptionTips?: string;
  variant?: import("@mui/material").TypographyProps["variant"];
}

const RichTextComponent: React.FC<RichTextProps> = ({
  content,
  descriptionTips,
  variant,
}) => {
  if (!content) {
    return (
      <Typography variant={variant ?? "body1"}>
        No description available.
      </Typography>
    );
  }
  return (
    <Typography variant={variant ?? "body1"}>
      {parseUnityRichText(content, descriptionTips ?? "")}
    </Typography>
  );
};

const parseUnityRichText = (
  content: string,
  descriptionTips: string
): React.ReactNode => {
  const buffIds = descriptionTips.split(";").map((buffId) => buffId.split(":"));

  const regex = /<color=([#a-fA-F0-9]+)>(.*?)<\/color>/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  content.replace(regex, (match, color, text, index) => {
    if (lastIndex < index) {
      elements.push(content.slice(lastIndex, index));
    }

    if (text.match(/^\{\d+\}$/)) {
      const buffIndex = parseInt(text.slice(1, -1));
      const buffId = buffIds[buffIndex];
      const buff: Buff =
        buffId[0] == "0"
          ? Tables.BattleBuffPerformData[parseInt(buffId[1])]
          : Tables.BattleDictionaryData[parseInt(buffId[1])];

      elements.push(
          <Tooltip
            key={index}
            title={
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} pb={0.5}>
                  {buff.iconName && <Box
                    component="img"
                    src={`${import.meta.env.BASE_URL}buffs/${
                      buff.iconName
                    }.png`}
                    alt={buff.name}
                    width={32}
                  />}
                  <Typography
                    variant="subtitle1"
                    color={color}
                  >
                    {buff.name}
                  </Typography>
                </Stack>
                <Divider />
                <RichTextComponent
                  content={buff.description}
                  descriptionTips={buff.descriptionTips}
                  variant="caption"
                />
              </Box>
            }
          >
            <span style={{ color, cursor: "help" }}>
              <u>{buff.name}</u>
            </span>
          </Tooltip>
      );
    } else {
      elements.push(
        <span key={index} style={{ color }}>
          {text}
        </span>
      );
    }
    lastIndex = index + match.length;
    return match;
  });
  if (lastIndex < content.length) {
    elements.push(content.slice(lastIndex));
  }
  return elements;
};

const SkillCard = ({ skill }: { skill: Skill }) => {
  if (!skill) return;
  //const [currentUpgrade, setCurrentUpgrade] = useState(0);
  const stabExists = skill.result
    .split(";")
    .find((element) => element[0] === "2");
  const stability = stabExists ? stabExists[2] : 0;

  function processInput(input: string) {
    const parts = input.split(",").map(Number);
    return parts.map((val) => (val % 100 ? val : val / 100));
  }
  const gridRange = processInput(skill.range);
  const gridShape = processInput(skill.shapeParam);
  let dispRange;
  switch (skill.skillRange) {
    case 1:
      dispRange = "Self";
      break;
    case 2:
      dispRange = "i x i";
      break;
    case 3:
      dispRange = gridRange[0];
      break;
    case 7:
      dispRange = "--";
      break;
    case 8:
      dispRange = "Map";
      break;
  }
  let dispShape;
  switch (skill.shape) {
    case 1:
      dispShape = "Target";
      break;
    case 2:
      dispShape = `${gridShape[0]} x ${gridShape[0]}`;
      break;
    case 3:
      dispShape = gridShape[0];
      break;
    case 7:
      dispShape = "--";
      break;
    case 8:
      dispShape = "Map";
      break;
  }

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <Grid2 container spacing={2}>
        {/* Left Section: Image, Name, and Tags */}
        <Grid2 size={{ xs: 4 }} sx={{ textAlign: "center" }}>
          <Typography variant="h5" color="secondary.main">
            {skill.name}
          </Typography>
          <Box
            component="img"
            src={`${import.meta.env.BASE_URL}skills/${skill.icon}.png`}
            alt="Skill Name"
            mt={2}
            sx={{ width: "50%", bgcolor: "primary.main", borderRadius: "8px" }}
          />
          <Stack direction="row" spacing={1} mt={1} justifyContent="center">
            {skill.skillTag.split(" / ").map((tag) => (
              <Chip key={tag} label={tag} color="primary" />
            ))}
          </Stack>

          {/* Stability/Cost/Cooldown Info */}
          <Stack direction="row" justifyContent="space-around" mt={2}>
            <Typography>{`Stability: ${stability}`}</Typography>
            <Typography>{`Cost: ${skill.potentialCost}`}</Typography>
            <Typography>{`Cooldown: ${skill.cdTime}`}</Typography>
          </Stack>
        </Grid2>

        {/* Center Section: Description & Upgrade Buttons */}

        <Grid2 size={{ xs: 4 }} sx={{ textAlign: "center" }}>
          <Box mt={2}>
            <RichTextComponent
              content={skill.description}
              descriptionTips={skill.descriptionTips}
            />
          </Box>
        </Grid2>

        {/* Right Section: Range, Target & Indicators */}
        <Grid2 size={{ xs: 4 }} sx={{ textAlign: "center" }}>
          {/* Visual Indicator Placeholder */}
          <SkillGrid
            range={skill.range}
            shape={skill.shape}
            shapeParam={skill.shapeParam}
            skillRange={skill.skillRange}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography mt={2}>Range</Typography>
            {
              <Typography mt={2} align="right">
                {dispRange}
              </Typography>
            }
          </Stack>
          <Divider sx={{ borderBottomWidth: 5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography mt={2}>Area of Effect</Typography>
            {<Typography mt={2}>{dispShape}</Typography>}
          </Stack>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SkillCard;
