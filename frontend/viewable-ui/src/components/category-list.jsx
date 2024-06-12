import { useEffect, useState } from 'react';

//import services
import DataService from '../services/data-service';

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
  Button
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Blogs(props) {
  let navigate = useNavigate();
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [categoryMetadata, setCategoryMetadata] = useState(null);

  useEffect(() => {
    DataService.getData('category/category-metadata').then(response =>
      setCategoryMetadata(response.data)
    );
    document.title = 'Categories'
  }, []);

  if (GlobalTheme && ThemeConfig) {
    return (
      <Container fluid className={`p-0 mb-2 ${ThemeConfig[GlobalTheme].background}`}>

        <Row className="justify-content-center align-items-center">
          <Col className="d-flex flex-column align-items-center">
            {/* Top Section - Categories */}
            <div className="w-100">
              <Col xs="3" className="d-md-block"><Button color={ThemeConfig[GlobalTheme].buttonColor} onClick={() => navigate(`/`)} className="ms-5 mt-5" outline><FontAwesomeIcon icon={faLeftLong}/></Button></Col>
            <Card className={`my-2 ${ThemeConfig[GlobalTheme].background}`} style={{width: "100%", border: "none"}}>
              <CardBody>
                <CardTitle style={{ display: "grid" }} className={`${ThemeConfig[GlobalTheme].textColor} justify-content-center`} tag="h1">
                  {"Categories"}
                </CardTitle>
              </CardBody>
            </Card>
            </div>
            {/* Bottom Section - Category Metadata or Spinner */}
            <div className="" style={{ width: '70%', margin: 'auto' }}>
              {categoryMetadata ?
                categoryMetadata.length > 0 ? categoryMetadata.map((item, index) => (
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
                )) : '' : <Spinner />}
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
