import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import CharacterGrid from './pages/CharacterGrid';
import CharacterOverlay from './pages/CharacterOverlay';
import WeaponGrid from './pages/WeaponGrid';
import WeaponOverlay from './pages/WeaponOverlay';
import EnemyGrid from './pages/EnemyGrid';
import { Chr, Wpn } from './types';
import { characters, weapons } from './data/data';
import { formatWeaponUrl } from './utils/wpn-utils';
import './index.css';

const baseUrl = import.meta.env.BASE_URL;

const RedirectionHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedPath = sessionStorage.getItem('redirectPath');

    if (savedPath && location.pathname === '/') {
      sessionStorage.removeItem('redirectPath');
      navigate(savedPath);
    }
  }, [navigate, location]);

  return <>{children}</>;
};

const CharacterOverlayWrapper: React.FC = () => {
  const { url } = useParams<{ url: string }>();

  if (!url) {
    return null;
  }

  const character: Chr | undefined = characters.find((chr: Chr) => chr.name.toLowerCase() === url);

  return <CharacterOverlay open={!!character} character={character} />;
};

const WeaponOverlayWrapper: React.FC = () => {
  const { url } = useParams<{ url: string }>();

  if (!url) {
    return null;
  }

  const weapon: Wpn | undefined = weapons.find((wpn: Wpn) => formatWeaponUrl(wpn.name) === url);

  return <WeaponOverlay open={!!weapon} weapon={weapon} />;
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-neutral-700">
      <Router basename={baseUrl}>
        <RedirectionHandler>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dolls" element={<CharacterGrid />} />
              <Route path="/dolls/:url" element={<CharacterOverlayWrapper />} />
              <Route path="/weapons" element={<WeaponGrid />} />
              <Route path="/weapons/:url" element={<WeaponOverlayWrapper />} />
              <Route path="/enemies" element={<EnemyGrid />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </RedirectionHandler>
      </Router>
    </div>
  );
};

export default App;
