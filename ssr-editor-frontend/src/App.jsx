import { Routes, Route, Link } from 'react-router-dom';
import List from './pages/List.jsx';
import Doc from './pages/Doc.jsx';

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>SSR Editor</h1>
        <nav>
          <Link to="/">Hem</Link> | <Link to="/new">Nytt dokument</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/new" element={<Doc isNew />} />
          <Route path="/:id" element={<Doc />} />
        </Routes>
      </main>
    </div>
  );
}
