// Update import paths based on your Argon source location
import {
  Navbar,
  NavbarBrand,
  UncontrolledCollapse,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Container,
  Spinner,
  Button
} from 'reactstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import ToggleButton from '../elements/toggle-button';

function Header(props) {

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  const UserData = props.UserData;

  const [collapseClasses, setCollapseClasses] = useState('');

  const onExiting = () => {
    setCollapseClasses('collapsing-out');
  };

  const onExited = () => {
    setCollapseClasses('');
  };

  return (
    <header className="header-global">
    <Navbar className={`navbar-horizontal navbar-dark ${ThemeConfig ? ThemeConfig.navbarColor : ""}`} expand="lg">
      <Container>
        <NavbarBrand>
        < Button
          color="danger"
          size="lg"
        >
          { UserData ? UserData.name : <Spinner> Loading... </Spinner> }
        </Button>
          
        </NavbarBrand>
        <button
            aria-controls="navbar-default"
            aria-expanded={false}
            aria-label="Toggle navigation"
            className="navbar-toggler"
            data-target="#navbar-default"
            data-toggle="collapse"
            id="navbar-default"
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>
        <UncontrolledCollapse navbar toggler="#navbar-default" className={collapseClasses} onExiting={onExiting} onExited={onExited}>
        <div className="navbar-collapse-header">
              <Row>
                <Col className="collapse-brand" xs="6">
                    { UserData ? UserData.name : <Spinner> Loading... </Spinner> }
                </Col>
                <Col className="collapse-close" xs="6">
                  <button
                    aria-controls="navbar-default"
                    aria-expanded={false}
                    aria-label="Toggle navigation"
                    className="navbar-toggler"
                    data-target="#navbar-default"
                    data-toggle="collapse"
                    id="navbar-default"
                    type="button"
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
          <Nav className="ml-lg-auto" navbar>
            <NavItem>
              <NavLink href="#home" onClick={(e) => e.preventDefault()}>
                Blogs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#about" onClick={(e) => e.preventDefault()}>
                About
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#about" onClick={(e) => e.preventDefault()}>
                Contact
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                <ToggleButton Id={"themeSwitch"} ThemeSwitcher={props.ThemeSwitcher}/>
                <span ><FontAwesomeIcon icon={GlobalTheme === "lightTheme" ? faSun : faMoon} /> {ThemeConfig ? ThemeConfig[GlobalTheme].theme : ""}</span>
              </NavLink>
            </NavItem>
          </Nav>
        </UncontrolledCollapse>
      </Container>
    </Navbar>
    </header>
  );
}

export default Header;