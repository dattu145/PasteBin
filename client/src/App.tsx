import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PasteCreate } from './PasteCreate';
import { PasteView } from './PasteView';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasteCreate />} />
        <Route path="/p/:id" element={<PasteView />} />
      </Routes>
    </Router>
  );
}

export default App;
