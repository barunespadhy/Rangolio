import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useEffect, useState} from 'react';

//Import Views
import HomePage from './components/views/home-page';

//Import 
import Header from './components/views/shared/navbar';
import Footer from './components/views/shared/footer';

//Import Services
import DataService from './services/data-service'

function App() {
  const [userData, setUserData] = useState(null);
  const [themeConfig, setThemeConfig] = useState(null);
  const [globalTheme, setGlobalTheme] = useState("lightTheme");

  useEffect(() => {
    DataService.getData('shared/user-data').then( response =>
      setUserData(response.data)
    )
    DataService.getData('shared/theme-config').then( response => 
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
            <Route path="/" element={<Footer GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
          </Routes>
          <Footer ThemeSwitcher={themeSwitcher} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />
        </Router>
    </div>
  );
}

export default App;