import { useEffect, useState } from 'react';
import DataService from '../../../services/data-service';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, ListGroup, ListGroupItem, ButtonGroup } from 'reactstrap';

function CategoryBar(props) {

  const [categoryMetadata, setCategoryMetadata] = useState([]);

  useEffect(() => {
    DataService.getData('category/category-metadata').then(response =>
      setCategoryMetadata(response.data)
    );
  }, []);

  const rowStyle = {
    height: 'auto',
    width: 'auto',
    overflowX: 'auto',
    display: 'grid',
  };

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  if (GlobalTheme && ThemeConfig)
  return (
    <Container fluid className={`${ThemeConfig[GlobalTheme].background}`}>
      <Row style={rowStyle}>
        <center style={{marginTop: '1.5em', marginBottom: '1.5em'}}>
          <Col>
            <ButtonGroup style={{marginTop: '15px', marginBottom: '15px'}}>
            {categoryMetadata.length > 0 ? 
                categoryMetadata.map((item, index) => (
                  <Button 
                    key={item.id}
                    className="btn-lg"
                    color={`${ThemeConfig[GlobalTheme].buttonColor}`}
                    outline
                    active={props.currentPage === item.id}
                  >
                  <Link className="p-3" to={`/categories/${item.id}`}>
                    {item.name}
                  </Link></Button>
              )) : <Spinner />
              }      
            </ButtonGroup>
          </Col>
        </center>
      </Row>
    </Container>
  );
};

export default CategoryBar;