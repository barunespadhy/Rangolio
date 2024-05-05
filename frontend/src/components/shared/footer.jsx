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
    <footer className={`footer p-4 text-white ${ThemeConfig ? ThemeConfig[GlobalTheme].footer['background'] : ""}`} id="site-footer">
      <Container className='p-1'>
        <Row>
          <Col md="12">
            <div className="text-center text-md-left mt-3">
              {new Date().getFullYear()}, <a href="/">{ UserData ? UserData.name : <Spinner> Loading... </Spinner> }</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;