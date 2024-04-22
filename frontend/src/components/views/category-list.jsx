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
  CardBody
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
      <Container fluid className={`p-0 ${ThemeConfig[GlobalTheme].background}`}>
        <Row className="justify-content-center align-items-center">
          <Col className="d-flex flex-column align-items-center min-vh-82">
            {/* Top Section - Categories */}
            <div className="w-100">
            <Card className={`my-2 ${ThemeConfig[GlobalTheme].background}`} style={{"width": "100%"}}>
              <CardBody>
                <CardTitle style={{ display: "grid" }} className={`${ThemeConfig[GlobalTheme].textColor} justify-content-center`} tag="h1">
                  {"Categories"}
                </CardTitle>
              </CardBody>
            </Card>
            </div>
            {/* Bottom Section - Category Metadata or Spinner */}
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
                    itemObject={item}
                  />
                )) : <Spinner />}
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
