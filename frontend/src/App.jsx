import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

//Import Views
import Home from './components/views/home';
import CategoryList from './components/views/category-list';
import BlogList from './components/views/blog-list';
import Blog from './components/views/blog';


//Import Shared Views
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

  const themeSwitcher = (theme) => {
    setGlobalTheme(theme);
  }

  return (
    <div>
      <Router>
        <Header ThemeSwitcher={themeSwitcher} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />
        <Routes>
          <Route path="/" element={<Home GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />} />
          <Route path="/categories" element={<CategoryList GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
          <Route path="/categories/:categoryID" element={<BlogList GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
          <Route path="/blog/:blogID" element={<Blog GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
        </Routes>
        <Footer ThemeSwitcher={themeSwitcher} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />
      </Router>
    </div>
  );
}

export default App;