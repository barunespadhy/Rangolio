import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import DataService from '../../services/data-service';
import MediaService from '../../services/media-service';
import CardListViewer from './shared/card-list-viewer';
import CategoryBar from './shared/category-bar';
import {
  Spinner,
  Container,
  Card,
  Row,
  Col,
  Button,
  CardTitle,
  CardBody
} from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function BlogList(props) {

  let navigate = useNavigate();

  const { categoryID } = useParams();

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [categoryData, setCategoryData] = useState('loading');
  const [featuredBlogData, setFeaturedBlogData] = useState('loading');
  const [currentPage, setCurrentPage] = useState('loading');
  
  useEffect(() => {
    DataService.getData(`category/${categoryID}/category-data`).then(response =>{
      setCategoryData(response.data);
      console.log(response.data)
      if (response.data.featuredBlog){
        DataService.getData(`blog/${response.data.featuredBlog}/blog-data`).then(response =>
          setFeaturedBlogData(response.data)
        );
      }
      else
        setFeaturedBlogData("nodata")
    }
    );
  }, [categoryID]);

  if (GlobalTheme && ThemeConfig) {
    return (
      <Container fluid className={` mb-2 p-0 ${ThemeConfig[GlobalTheme].background}`}>
        <Col xs="3" className="d-none d-md-block"><Button color={ThemeConfig[GlobalTheme].buttonColor} onClick={() => navigate(`/categories`)} className="ms-5 mt-5" outline><FontAwesomeIcon icon={faLeftLong}/></Button></Col>
        <CategoryBar currentPage={categoryID} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig}/>
        <Row className="justify-content-center align-items-center">
          <Col className="d-flex flex-column align-items-center">
            <div className="w-100">
            <Card className={`my-2 ${ThemeConfig[GlobalTheme].background}`} style={{width: "100%", border: "none"}}>
              <CardBody>
                <CardTitle style={{ display: "grid" }} className={`${ThemeConfig[GlobalTheme].textColor} justify-content-center`} tag="h1">
                  {`Blogs in ${categoryData.name}`}
                </CardTitle>
              </CardBody>
            </Card>
            </div>
            <div className="" style={{ width: '70%', margin: 'auto', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className={`${ThemeConfig[GlobalTheme].textColor}`}>
            {`Featured`}
            </h3>
            {
              featuredBlogData === 'loading' ? <Spinner /> :
              <CardListViewer
                key={featuredBlogData.id}
                totalItems={featuredBlogData === 'nodata' ? 0 : 1}
                cardType={"longCard"}
                resourceType={"blog"}
                textColor={ThemeConfig[GlobalTheme].textColor}
                bgColor={ThemeConfig[GlobalTheme].background}
                borderColor={ThemeConfig[GlobalTheme].borderColor}
                itemObject={featuredBlogData}
              />
            }
            {
              categoryData === 'loading' ? <Spinner /> :
              categoryData.blogMetadata.map((item, index) => (
                <CardListViewer
                  key={item.id}
                  totalItems={categoryData.blogMetadata.length} 
                  cardType={"smallCard"} 
                  resourceType={"blog"}
                  textColor={ThemeConfig[GlobalTheme].textColor} 
                  bgColor={ThemeConfig[GlobalTheme].background} 
                  borderColor={ThemeConfig[GlobalTheme].borderColor}
                  itemObject={item}
                />
              ))
            }
            </div>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return null;
  }

}

export default BlogList