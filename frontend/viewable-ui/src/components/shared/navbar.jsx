// Update import paths based on your Argon source location
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
  Spinner,
  Button, ButtonGroup
} from 'reactstrap';
import { useState, useEffect } from 'react';
import MediaService from '../../services/media-service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faPen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Header(props) {

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  const UserData = props.UserData;
  const [themeSelected, setThemeSelected] = useState('lightTheme');

  useEffect(() => {
    props.ThemeSwitcher(themeSelected)
  }, [themeSelected])

  useEffect(() => {
    setThemeSelected(props.ThemeConfig.defaultTheme)
  }, [])

  if (GlobalTheme && ThemeConfig && UserData)
    return (
      <header className='header-global' id='site-header'>
        <Navbar className={`navbar-horizontal ${ThemeConfig[GlobalTheme].navBar['navBarTheme']} ${ThemeConfig[GlobalTheme].navBar['background']}`}
          expand='lg'>
          <Container>
            <NavbarBrand>
              {
                UserData.profilePhoto !== '' ?
                  <img
                    style={{ width: '40px', height: '40px', objectFit: 'cover', 'marginRight': '10px' }}
                    className='rounded-circle'
                    alt={UserData.name}
                    src={MediaService.getMedia(UserData.profilePhoto)}
                  /> : ''
              }
              <Button color={`${ThemeConfig ? ThemeConfig[GlobalTheme].navBar['buttonColor'] : ''}`} size='lg'>
                <Link to='/'>
                  { UserData ? UserData.name : <Spinner> Loading... </Spinner> }
                </Link>
              </Button>
            </NavbarBrand>
            <Nav className='ml-lg-auto' navbar>
              <NavItem>
                <ButtonGroup style={{marginTop: '15px', marginBottom: '15px'}}>
                  <Button color={`${ThemeConfig ? ThemeConfig[GlobalTheme].navBar['buttonColor'] : ''}`}>
                    <Link to='/categories'>
                      <FontAwesomeIcon icon={faPen} /> Blogs
                    </Link>
                  </Button>
                  <Button
                    color={`${ThemeConfig ? ThemeConfig[GlobalTheme].navBar['buttonColor'] : ''}`}
                    outline
                    onClick={() => {setThemeSelected('lightTheme')}}
                    active={themeSelected === 'lightTheme'}
                  >
                    <FontAwesomeIcon icon={faSun} /> Light Theme
                  </Button>
                  <Button
                    color={`${ThemeConfig ? ThemeConfig[GlobalTheme].navBar['buttonColor'] : ''}`}
                    outline
                    onClick={() => {setThemeSelected('darkTheme')}}
                    active={themeSelected === 'darkTheme'}
                  >
                    <FontAwesomeIcon icon={faMoon}/> Dark Theme
                  </Button>
                </ButtonGroup>
              </NavItem>
            </Nav>
          </Container>
        </Navbar>
      </header>
    );
}

export default Header;