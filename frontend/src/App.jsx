import { Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";


import Landing from "./pages/Landing";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/onboarding" element={<h1>Onboarding Coming Soon</h1>} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}

export default App;