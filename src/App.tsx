import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import CharacterGrid from './pages/CharacterGrid';
import CharacterOverlay from './pages/CharacterOverlay';
import WeaponGrid from './pages/WeaponGrid';
import WeaponOverlay from './pages/WeaponOverlay';
import { Chr, Wpn } from './types';
import { characters, weapons } from './data/data';
import { formatWeaponUrl } from './utils/wpn-utils';
import './index.css';

const CharacterOverlayWrapper: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();

  if (!url) {
    return null;
  }

  const character: Chr | undefined = characters.find((chr: Chr) => chr.name.toLowerCase() === url);

  return (
    <CharacterOverlay open={!!character} onClose={() => navigate('/dolls')} character={character} />
  );
};

const WeaponOverlayWrapper: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();

  if (!url) {
    return null;
  }

  const weapon: Wpn | undefined = weapons.find((wpn: Wpn) => formatWeaponUrl(wpn.name) === url);

  return <WeaponOverlay open={!!weapon} onClose={() => navigate('/weapons')} weapon={weapon} />;
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-200 text-neutral-700">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dolls" element={<CharacterGrid />} />
            <Route path="/dolls/:url" element={<CharacterOverlayWrapper />} />
            <Route path="/weapons" element={<WeaponGrid />} />
            <Route path="/weapons/:url" element={<WeaponOverlayWrapper />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
