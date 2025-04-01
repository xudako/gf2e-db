import { HashRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import CharacterGrid from './pages/CharacterGrid';
import CharacterOverlay from './pages/CharacterOverlay';
import WeaponGrid from './pages/WeaponGrid';
import WeaponOverlay from './pages/WeaponOverlay';
import { Chr, Wpn } from './types';
import { characters, weapons } from './data/data';
import './index.css';

const CharacterOverlayWrapper: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const character: Chr | undefined = characters.find((gun: Chr) => gun.name === name);

  return (
    <CharacterOverlay open={!!character} onClose={() => navigate('/dolls')} character={character} />
  );
};

const WeaponOverlayWrapper: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const weapon: Wpn | undefined = weapons.find((wpn: Wpn) => wpn.name === name);

  return (
    <WeaponOverlay open={!!weapon} onClose={() => navigate('/weapons')} weapon={weapon} />
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-200 text-neutral-700">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dolls" element={<CharacterGrid />} />
            <Route path="/dolls/:name" element={<CharacterOverlayWrapper />} />
            <Route path="/weapons" element={<WeaponGrid />} />
            <Route path="/weapons/:name" element={<WeaponOverlayWrapper />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
