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
import EditableDataService from './services/editable-data-service'

function AppEditable() {
  const [userData, setUserData] = useState(null);
  const [themeConfig, setThemeConfig] = useState(null);
  const [globalTheme, setGlobalTheme] = useState("lightTheme");
  const [isOpen, setIsOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("")

  const notificationToggler = (message, color) => {
    setIsOpen(true)
    setNotificationMessage({message: message, color: color})
    setTimeout(() => {
      setIsOpen(false)
    }, 1500)
  }

  const setInfo = async (path, data) => {
    try {
      const response = await EditableDataService.updateData(path, data);
      setConfigData();
      return response.status;
    } catch (error) {
      return error.response ? error.response.status : 500;
    }
  }

  const setConfigData = () => {
    EditableDataService.getData('/data/shared/user-data/').then( response => {
        let responseData = response.data[0]
        setUserData({
          "name": responseData["name"],
          "introContent": responseData["intro_content"],
          "profilePhoto": responseData["profile_photo"]
        })
      }
    )
    EditableDataService.getData('/data/shared/theme-config/').then( response =>{
        let responseData = response.data[0]
        setThemeConfig({
          "defaultTheme": responseData["default_theme"],
          "darkTheme": JSON.parse(responseData["dark_theme"]),
          "lightTheme": JSON.parse(responseData["light_theme"])
        })
      }
    )
  }

  useEffect(() => {
    setConfigData()
  },[])

  const themeSwitcher = (theme) => {
    setGlobalTheme(theme);
  }

  if (themeConfig && userData && globalTheme)
  return (
    <div className="app-container">
      <Router>
        <Header className="header" ThemeSwitcher={themeSwitcher} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} notificationToggler={notificationToggler} setInfo={setInfo} />
        <div className={`p-0 ${themeConfig[globalTheme].background}`}>
          <Routes>
            <Route path="/" element={<Home notificationToggler={notificationToggler} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} setInfo={setInfo} />} />
            <Route path="/categories" element={<CategoryList notificationToggler={notificationToggler} GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
            <Route path="/categories/:categoryID" element={<BlogList notificationToggler={notificationToggler} GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
            <Route path="/blog/:blogID" element={<Blog notificationToggler={notificationToggler} GlobalTheme={globalTheme} ThemeConfig={themeConfig} />} />
          </Routes>
        </div>
        <Footer notificationToggler={notificationToggler} setInfo={setInfo} className="footer" ThemeSwitcher={themeSwitcher} GlobalTheme={globalTheme} ThemeConfig={themeConfig} UserData={userData} />
        <Notification style={{width: '20%'}} className="fixed-top" isOpen={isOpen} message={notificationMessage} />
      </Router>
    </div>
  );
}

export default AppEditable;