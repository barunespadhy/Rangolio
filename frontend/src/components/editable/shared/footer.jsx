import React from 'react';
// Import necessary components from Argon Design System
import {
  Container,
  Row,
  Col,
  Nav,
  NavLink,
  Spinner,
  Button,
  ButtonGroup
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faPen, faBrush } from '@fortawesome/free-solid-svg-icons';

const Footer = (props) => {
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  const UserData = props.UserData;

  const setInfo = async (color, colorArea) => {
    let localThemeConfig = {...ThemeConfig}
    localThemeConfig[GlobalTheme].footer[colorArea] = `${color}`
    let response = await props.setInfo('/data/shared/update/theme-config/', GlobalTheme === "darkTheme" ? {
      "dark_theme": JSON.stringify(localThemeConfig[GlobalTheme]),
    }:{
      "light_theme": JSON.stringify(localThemeConfig[GlobalTheme]),
    })
    if (response === 200)
      props.notificationToggler(`Color set for ${ThemeConfig[GlobalTheme].theme} successfully!`)
    if ([500, 404, 403].includes(response))
      props.notificationToggler("Something failed!", "danger")
  }

  return (
    <footer className={`footer p-4 ${ThemeConfig ? ThemeConfig[GlobalTheme].footer['background'] + ' ' + ThemeConfig[GlobalTheme].footer['text'] : ""}`} id="site-footer">
      <Container className='p-1'>
        <Row>
        <ButtonGroup style={{marginTop: '15px', marginBottom: '15px', marginRight: '15px'}}>
              <Button disabled color={`${ThemeConfig ? ThemeConfig[GlobalTheme].navBar['buttonColor'] : ""}`}>      
                <FontAwesomeIcon icon={faBrush} /> Set color
              </Button>
              <Button
                color='primary'
                onClick={() => setInfo('bg-primary', 'background')}/>
              <Button
                color='secondary'
                onClick={() => setInfo('bg-secondary', 'background')}/>
              <Button
                color='success'
                onClick={() => setInfo('bg-success', 'background')}/>
              <Button
                color='danger'
                onClick={() => setInfo('bg-danger', 'background')}/>
              <Button
                color='warning'
                onClick={() => setInfo('bg-warning', 'background')}/>
              <Button
                color='info'
                onClick={() => setInfo('bg-info', 'background')}/>
              <Button
                color='light'
                onClick={() => setInfo('bg-light', 'background')}/>
              <Button
                color='dark'
                onClick={() => setInfo('bg-dark', 'background')}/>
            </ButtonGroup>
            <ButtonGroup style={{marginTop: '15px', marginBottom: '15px'}}>
              <Button disabled color={`${ThemeConfig ? ThemeConfig[GlobalTheme].navBar['buttonColor'] : ""}`}>      
                <FontAwesomeIcon icon={faBrush} /> Set footer text color
              </Button>
              <Button
                color='dark'
                onClick={() => setInfo('text-light', 'text')}>White on black</Button>
              <Button
                color='light'
                onClick={() => setInfo('text-black', 'text')}>Black on white</Button>
            </ButtonGroup>
          <Col md="12">
            <div className="blogContent text-center text-md-left mt-3">
              {new Date().getFullYear()}, <a className={`${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`} href="/">{ UserData ? UserData.name : <Spinner> Loading... </Spinner> }</a>
              <br />
              Built with <a className={`${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`} href="https://github.com/barunespadhy/rangolio">Rangolio</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;