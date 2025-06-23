import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1 className="text-4xl font-bold">Bienvenido a la UNICA</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
