import { useEffect } from 'react';
import { Container, Row } from 'reactstrap';

function NotFound(props) {
  
  useEffect(() => {
    document.title = '404 Not Found'
  }, [])

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  if (GlobalTheme && ThemeConfig) 
  return (
    <Container fluid className={`p-0 mt-5 ${ThemeConfig[GlobalTheme].background}`}>
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-82">
        <Row className="mb-4">
          <h1 className={`${ThemeConfig[GlobalTheme].textColor}`}>
            404 Page not found
          </h1>
        </Row>
      </div>
    </Container>
  );
}

export default NotFound;