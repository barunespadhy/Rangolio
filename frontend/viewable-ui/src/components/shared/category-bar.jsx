import { useEffect, useState } from 'react';
import DataService from '../../services/data-service';
import { Container, Row, Col, Button, Spinner, ButtonGroup } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

function CategoryBar(props) {

  let navigate = useNavigate();
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
                  categoryMetadata.map((item) => (
                    <Button
                      key={item.id}
                      className="btn-lg"
                      onClick={() => navigate(`/categories/${item.id}`)}
                      color={`${ThemeConfig[GlobalTheme].buttonColor}`}
                      outline
                      active={props.currentPage === item.id}
                    >
                      {item.name}
                    </Button>
                  )) : <Spinner />
                }
              </ButtonGroup>
            </Col>
          </center>
        </Row>
      </Container>
    );
}

export default CategoryBar;