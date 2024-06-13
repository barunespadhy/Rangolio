import React from 'react';
// Import necessary components from Argon Design System
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  ButtonGroup
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush } from '@fortawesome/free-solid-svg-icons';

const Footer = (props) => {
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  const UserData = props.UserData;

  const setInfo = async (colorArea, color) => {
    let localThemeConfig = {...ThemeConfig}
    localThemeConfig[GlobalTheme].footer[colorArea] = `${color}`
    let response = await props.setInfo('/data/shared/update/theme-config/', GlobalTheme === 'darkTheme' ? {
      'dark_theme': JSON.stringify(localThemeConfig[GlobalTheme]),
    }:{
      'light_theme': JSON.stringify(localThemeConfig[GlobalTheme]),
    })
    if (response === 200)
      props.notificationToggler(`Color set for ${ThemeConfig[GlobalTheme].theme} successfully!`)
    if ([500, 404, 403].includes(response))
      props.notificationToggler('Something failed!', 'danger')
  }

  return (
    <footer className={`footer p-4 ${ThemeConfig ? ThemeConfig[GlobalTheme].footer['background'] + ' ' + ThemeConfig[GlobalTheme].footer['text'] : ''}`} id='site-footer'>
      <Container className='p-1'>
        <Row>
          <ButtonGroup style={{marginTop: '15px', marginBottom: '15px', marginRight: '15px'}}>
            <Button disabled color={`${ThemeConfig ? ThemeConfig[GlobalTheme].navBar['buttonColor'] : ''}`}>
              <FontAwesomeIcon icon={faBrush} /> Set color
            </Button>
            <Button
              color='primary'
              onClick={() => setInfo('background', 'bg-primary')}/>
            <Button
              color='secondary'
              onClick={() => setInfo('background', 'bg-secondary')}/>
            <Button
              color='success'
              onClick={() => setInfo('background', 'bg-success')}/>
            <Button
              color='danger'
              onClick={() => setInfo('background', 'bg-danger')}/>
            <Button
              color='warning'
              onClick={() => setInfo('background', 'bg-warning')}/>
            <Button
              color='info'
              onClick={() => setInfo('background', 'bg-info')}/>
            <Button
              color='light'
              onClick={() => setInfo('background', 'bg-light')}/>
            <Button
              color='dark'
              onClick={() => setInfo('background', 'bg-dark')}/>
          </ButtonGroup>
          <ButtonGroup style={{marginTop: '15px', marginBottom: '15px'}}>
            <Button disabled color={`${ThemeConfig ? ThemeConfig[GlobalTheme].navBar['buttonColor'] : ''}`}>
              <FontAwesomeIcon icon={faBrush} /> Set footer text color
            </Button>
            <Button
              color='light'
              onClick={() => setInfo('text', 'text-white')}>White</Button>
            <Button
              color='dark'
              onClick={() => setInfo('text', 'text-black')}>Black</Button>
          </ButtonGroup>
          <Col md='12'>
            <div className='blogContent text-center text-md-left mt-3'>
              {new Date().getFullYear()}, <a className={`${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`} href='/'>{ UserData ? UserData.name : <Spinner> Loading... </Spinner> }</a>
              <br />
              <div className='m-2'>
                { UserData.builtWith ? <span>Built with <a target='_blank' className={`${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`} href='https://github.com/barunespadhy/rangolio' rel="noreferrer">Rangolio</a></span>:''}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;