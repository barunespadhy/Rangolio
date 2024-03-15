import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useEffect, useState} from 'react';
import HomePage from './components/views/home-page';
import Header from './components/views/navbar';
import DataService from './services/data-service'

function App() {
  const [userData, setUserData] = useState(null);
  const [themeConfig, setThemeConfig] = useState(null);
  const [globalTheme, setGlobalTheme] = useState("lightTheme");

  useEffect(() => {
    DataService.getData('user-data').then( response =>
      setUserData(response.data)
    )
    DataService.getData('theme-config').then( response => 
      setThemeConfig(response.data)
    )
  },[])

  const themeSwitcher = (e) => {
    e.target.checked ? setGlobalTheme("darkTheme") : setGlobalTheme("lightTheme");
  }

  return (
    <div>
        <Router>
          <Header ThemeSwitcher={themeSwitcher} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />
          <Routes>
            <Route path="/" element={<HomePage GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;