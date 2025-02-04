import {
  Box,
  Grid2,
  Typography,
  Chip,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import { Skill } from "../types";
import SkillGrid from "./SkillGrid";

const RichTextComponent: React.FC<{ content: string | undefined }> = ({
  content,
}) => {
  if (!content) {
    return <div>No description available.</div>;
  }
  return <div>{parseUnityRichText(content)}</div>;
};

const parseUnityRichText = (content: string): React.ReactNode => {
  const regex = /<color=([#a-fA-F0-9]+)>(.*?)<\/color>/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  content.replace(regex, (match, color, text, index) => {
    if (lastIndex < index) {
      elements.push(content.slice(lastIndex, index));
    }
    elements.push(
      <span key={index} style={{ color }}>
        {text}
      </span>
    );
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
  const dispRange = skill.skillRange != 8 ? gridRange[0].toString() : "Map";
  let dispShape;
  switch (skill.shape) {
    case 1:
      dispShape = "Target";
      break;
    case 2:
      dispShape = `${gridShape[0]} x ${gridShape[0]}`;
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
            src={`/skills/${skill.icon}.png`}
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
            {stability && (
              <Tooltip title="Stability">
                <Typography>{`Stability: ${stability}`}</Typography>
              </Tooltip>
            )}
            {skill.potentialCost && (
              <Tooltip title="Cost">
                <Typography>{`Cost: ${skill.potentialCost}`}</Typography>
              </Tooltip>
            )}
            {skill.cdTime && (
              <Tooltip title="Cooldown">
                <Typography>{`Cooldown: ${skill.cdTime}`}</Typography>
              </Tooltip>
            )}
          </Stack>
        </Grid2>

        {/* Center Section: Description & Upgrade Buttons */}

        <Grid2 size={{ xs: 4 }} sx={{ textAlign: "center" }}>
          {skill.description && (
            <Stack direction="row" spacing={1} justifyContent="center">
              {/* <Button
                variant="outlined"
                disabled={currentUpgrade === 0}
                onClick={() => setCurrentUpgrade((prev) => prev - 1)}
              >
                Previous Upgrade
              </Button>
              <Button
                variant="outlined"
                disabled={currentUpgrade === skill.descriptionID.length - 1}
                onClick={() => setCurrentUpgrade((prev) => prev + 1)}
              >
                Next Upgrade
              </Button> */}
            </Stack>
          )}
          <Typography mt={2}>
            <RichTextComponent content={skill.description} />
          </Typography>
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
            {<Typography mt={2} align="right">
              {dispRange}
            </Typography>}
          </Stack>
          <Divider sx={{ borderBottomWidth: 5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography mt={2}>Area of Effect</Typography>
            {<Typography mt={2}>
              {dispShape}
            </Typography>}
          </Stack>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SkillCard;
