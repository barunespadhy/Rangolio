import React from 'react';
// Import necessary components from Argon Design System
import {
  Container,
  Row,
  Col,
  Nav,
  NavLink,
  Spinner
} from 'reactstrap';

const Footer = (props) => {
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  const UserData = props.UserData;

  return (
    <footer className={`footer text-white ${ThemeConfig ? ThemeConfig.navbarColor : ""}`}>
      <Container>
        <Row className="align-items-center justify-content-md-between">
          <Col md="6">
            <Nav className="nav-footer justify-content-center justify-content-md-start">
              <NavLink
                className = "text-white"
                href="#"
                target="_blank"
              >
                { UserData ? UserData.name : <Spinner> Loading... </Spinner> }
              </NavLink>
              <NavLink
                className = "text-white"
                href="#"
                target="_blank"
              >
                About
              </NavLink>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className="text-center text-md-left mt-3">
              {new Date().getFullYear()} <a href="" target="_blank">{ UserData ? UserData.name : <Spinner> Loading... </Spinner> }</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;