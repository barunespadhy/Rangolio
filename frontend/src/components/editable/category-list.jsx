import { useEffect, useState } from 'react';

//import services
import DataService from '../../services/data-service';

//import views
import CardListViewer from './shared/card-list-viewer';

import {
  Spinner,
  Row,
  Col,
  Container,
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardBody,
  Button,
  ButtonGroup
} from 'reactstrap';
import { Link } from 'react-router-dom';

function Blogs(props) {
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [categoryMetadata, setCategoryMetadata] = useState([]);

  useEffect(() => {
    DataService.getData('category/category-metadata').then(response =>
      setCategoryMetadata(response.data)
    );
  }, []);

  if (GlobalTheme && ThemeConfig) {
    return (
      <Container fluid className={`p-0 mb-2 ${ThemeConfig[GlobalTheme].background}`}>
        <Row className="justify-content-center align-items-center">
          <Col className="d-flex flex-column align-items-center">
            <div className="w-100">
            <Card className={`my-2 ${ThemeConfig[GlobalTheme].background}`} style={{width: "100%", border: "none"}}>
              <CardBody>
                <CardTitle style={{ display: "grid" }} className={`${ThemeConfig[GlobalTheme].textColor} justify-content-center`} tag="h1">
                  {"Categories"}<Button className='mt-2' color={ThemeConfig[GlobalTheme].buttonColor} outline>Add New</Button>
                </CardTitle>
              </CardBody>
            </Card>
            </div>
            
            <div className="" style={{ width: '70%', margin: 'auto' }}>

              {categoryMetadata.length > 0 ? 
                categoryMetadata.map((item, index) => (
                  <CardListViewer 
                    key={item.id}
                    totalItems={categoryMetadata.length} 
                    cardType={"longCard"} 
                    resourceType={"categories"}
                    textColor={ThemeConfig[GlobalTheme].textColor} 
                    bgColor={ThemeConfig[GlobalTheme].background} 
                    borderColor={ThemeConfig[GlobalTheme].borderColor}
                    itemObject={item}
                  />
                )) : <Spinner />}
              <ButtonGroup className='mt-4'>
                <Button color={ThemeConfig[GlobalTheme].buttonColor} outline>Save Data</Button>
                <Button color={ThemeConfig[GlobalTheme].buttonColor} outline>Publish Data</Button>
              </ButtonGroup>
            </div>
          </Col>
          
        </Row>
      </Container>
    );
  } else {
    return null;
  }
}

export default Blogs;
