import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

//Import Views
import Home from './components/editable/home';
import CategoryList from './components/editable/category-list';
import BlogList from './components/editable/blog-list';
import Blog from './components/editable/blog';


//Import Shared Views
import Header from './components/editable/shared/navbar';
import Footer from './components/editable/shared/footer';
import Notification from './components/editable/shared/notification';

//Import Services
import DataService from './services/data-service'

function AppEditable() {
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
        <Notification isOpen={isOpen} message={notificationMessage} />
        <div className={`p-0 ${themeConfig[globalTheme].background}`}>
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

export default AppEditable;