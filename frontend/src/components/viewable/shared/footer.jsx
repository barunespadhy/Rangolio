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

  if (UserData)
  return (
    <footer className={`footer p-4 ${ThemeConfig ? ThemeConfig[GlobalTheme].footer['background'] + ' ' + ThemeConfig[GlobalTheme].footer['text'] : ""}`} id="site-footer">
      <Container className='p-1'>
        <Row>
          <Col md="12">
            <div className="blogContent text-center text-md-left mt-3">
              {new Date().getFullYear()}, <a className={`${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`} href="/">{ UserData ? UserData.name : <Spinner> Loading... </Spinner> }</a>
              <br />
              <div className='m-2'>
                { UserData.builtWith ? <span>Built with <a target="_blank" className={`${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`} href="https://github.com/barunespadhy/rangolio">Rangolio</a></span>:""}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;