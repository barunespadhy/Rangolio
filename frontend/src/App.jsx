import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

//Import Views
import Home from './components/viewable/home';
import CategoryList from './components/viewable/category-list';
import BlogList from './components/viewable/blog-list';
import Blog from './components/viewable/blog';


//Import Shared Views
import Header from './components/viewable/shared/navbar';
import Footer from './components/viewable/shared/footer';
import Notification from './components/viewable/shared/notification';

//Import Services
import DataService from './services/data-service'

function App() {
  const [userData, setUserData] = useState(null);
  const [themeConfig, setThemeConfig] = useState(null);
  const [globalTheme, setGlobalTheme] = useState("lightTheme");
  const [isOpen, setIsOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("")

  const notificationToggler = (message) => {
    setIsOpen(true)
    setNotificationMessage(message)
    setTimeout(() => {
      setIsOpen(false)
    }, 3500)
  }

  useEffect(() => {
    DataService.getData('shared/user-data').then( response =>
    setUserData(response.data)
    )
    DataService.getData('shared/theme-config').then( response =>{
        setThemeConfig(response.data)
        setGlobalTheme(response.data.defaultTheme)
      }
    )
  },[])

  const themeSwitcher = (theme) => {
    setGlobalTheme(theme);
  }

  if (themeConfig)
  return (
    <div className="app-container">
      <Router>
        <Header className="header" ThemeSwitcher={themeSwitcher} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />
        <div className={`p-0 ${themeConfig[globalTheme].background}`}>
          <Notification isOpen={isOpen} message={notificationMessage} />
          <Routes>
            <Route path="/" element={<Home GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />} />
            <Route path="/categories" element={<CategoryList notificationToggler={notificationToggler} GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
            <Route path="/categories/:categoryID" element={<BlogList notificationToggler={notificationToggler} GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
            <Route path="/blog/:blogID" element={<Blog notificationToggler={notificationToggler} GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
          </Routes>
        </div>
        <Footer className="footer" ThemeSwitcher={themeSwitcher} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />
      </Router>
    </div>
  );
}

export default App;