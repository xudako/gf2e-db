import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CharacterGrid from "./pages/CharacterGrid";
import WeaponGrid from "./pages/WeaponGrid";
import { GlobalStyles } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#444444",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f26c1c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#888888",
      paper: "#ffffff",
    },
    text: {
      primary: "#444444",
      secondary: "#666666",
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
            <Route path="/weapons" element={<WeaponGrid />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
