import { useEffect } from 'react';
import { Container, Spinner, Row, Col } from 'reactstrap';
import parse from 'html-react-parser';
import MediaService from '../services/media-service'

function HomePage(props) {
  
  const replace = (node) => {
    if (node.type === 'tag') {
      if (node.name === 'a') {
        const newClasses = `${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`;
        const existingClasses = node.attribs.class ? `${node.attribs.class} ` : '';
        node.attribs.class = `${existingClasses}${newClasses}`;
        node.attribs.rel = 'noopener noreferrer';
        node.attribs.target = '_blank';
      }
      if (node.name === 'img') {
        const newClasses = 'img-fluid mt-2 mb-2 rounded mx-auto d-block';
        const existingClasses = node.attribs.class ? `${node.attribs.class} ` : '';
        node.attribs.class = `${existingClasses}${newClasses}`;
      }
    }
  };

  useEffect(() => {
    document.title = UserData.name
  }, [])

  const UserData = props.UserData ? props.UserData : <Spinner> Loading... </Spinner>
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  const introContent = props.UserData ? parse(props.UserData.introContent, { replace }) : ''

  if (GlobalTheme && ThemeConfig) 
    return (
      <Container fluid className={`${ThemeConfig[GlobalTheme].background}`}>
        <Row className='mb-4'>
          <Col xs='3' className='d-none d-md-block'></Col>
          <Col className='p-0'>
            {UserData.profilePhoto !== '' ? <img style={{ width: '180px', height: '180px', objectFit: 'cover' }} alt={UserData.name} className='mt-5 mx-auto d-block rounded-circle' src={MediaService.getMedia(UserData.profilePhoto)} /> : ''}
          </Col>
          <Col xs='3' className='d-none d-md-block'></Col>
        </Row>
        <Row className={`mb-5 mt-2 ${ThemeConfig[GlobalTheme].textColor}`}>
          <Col xs='3' className='d-none d-md-block'></Col>
          <Col className='p-2 blogContent'>
            <div className={`blogContent ${ThemeConfig[GlobalTheme].textColor}`}>{introContent}</div>
          </Col>
          <Col xs='3' className='d-none d-md-block'></Col>
        </Row>
      </Container>
    );
}

export default HomePage;