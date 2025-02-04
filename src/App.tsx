import {
  HashRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CharacterGrid from "./pages/CharacterGrid";
import CharacterOverlay from "./pages/CharacterOverlay";
import WeaponGrid from "./pages/WeaponGrid";
import { GlobalStyles } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Chr } from "./types";
import { characters } from "./data/data";

const theme = createTheme({
  palette: {
    primary: {
      main: "#373e44",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f26c1c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#999999",
      paper: "#dddddd",
    },
    text: {
      primary: "#373e44",
      secondary: "#666666",
    },
    raritySSR: {
      main: "#de9e01",
    },
    raritySR: {
      main: "#7967ba",
    },
    info: {
      main: "#6979d9",
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          fontFamily: "'Roboto', sans-serif",
          backgroundColor: "#f5f5f5",
        },
      },
    },
  },
});

const CharacterOverlayWrapper: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const character: Chr | undefined = characters.find(
    (gun: Chr) => gun.name === name
  );

  return (
    <CharacterOverlay
      open={!!character}
      onClose={() => navigate("/dolls")}
      character={character}
    />
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: "background.default",
            margin: 0,
            padding: 0,
            height: "100%",
            width: "100%",
          },
        }}
      />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dolls" element={<CharacterGrid />} />
            <Route path="/dolls/:name" element={<CharacterOverlayWrapper />} />
            <Route path="/weapons" element={<WeaponGrid />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
