import React from "react";
import Home from './pages/Home';
import {MainPopup} from './components/Popup/MainPopup';
import "./App.module.css";

function App() {
  return (
    <div>
      <MainPopup />
      <Home />
    </div>
  );
}

export default App;
