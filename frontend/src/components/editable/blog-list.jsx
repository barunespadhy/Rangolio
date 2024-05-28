import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import EditableDataService from '../../services/editable-data-service';
import MediaService from '../../services/media-service';
import CardListViewer from './shared/card-list-viewer';
import CategoryBar from './shared/category-bar';
import {
  Spinner,
  Container,
  Card,
  Row,
  Col,
  CardImg,
  CardTitle,
  CardText,
  CardBody
} from 'reactstrap';
import { Link, useParams } from 'react-router-dom';

function BlogList(props) {

  const { categoryID } = useParams();

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [categoryData, setCategoryData] = useState('loading');
  const [currentPage, setCurrentPage] = useState('loading');

  useEffect(() => {
    EditableDataService.getData(`/data/category/${categoryID}/`).then(response => {
        let responseData = response.data
        let blogMetadata = []
        console.log(responseData)
        let localCategoryData = {
                "id": responseData["category_id"],
                "name": responseData["name"],
                "coverImage": responseData["cover_image"],
                "tagLine": responseData["tagline"],
                "description": responseData["description"],
                "featuredBlog": responseData["featured_id"],
                "blogMetadata": responseData["blog_metadata"]
            }
        for (let eachBlog of responseData["blog_metadata"]){
          blogMetadata.push({
            "id": eachBlog["blog_id"],
            "name": eachBlog["name"],
            "description": eachBlog["description"],
            "tagLine": eachBlog["tagline"],
            "coverImage": eachBlog["cover_image"],
            "parentCategory": eachBlog["parent_category"]
          })
        }
        localCategoryData.blogMetadata = blogMetadata
        setCategoryData(localCategoryData)
      }
    );
  }, [categoryID]);

  if (GlobalTheme && ThemeConfig) {
return (
  <Container fluid className={`mb-2 p-0 ${ThemeConfig[GlobalTheme].background}`}>
    <CategoryBar currentPage={categoryID} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig} />
    <Row className="justify-content-center align-items-center">
      <Col className="d-flex flex-column align-items-center">
        <div className="w-100">
          <Card className={`my-2 ${ThemeConfig[GlobalTheme].background}`} style={{ width: "100%", border: "none" }}>
            <CardBody>
              <CardTitle style={{ display: "grid" }} className={`${ThemeConfig[GlobalTheme].textColor} justify-content-center`} tag="h1">
                {`Blogs in ${categoryData.name}`}
              </CardTitle>
            </CardBody>
          </Card>
        </div>
        <div className="" style={{ width: '70%', margin: 'auto', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 className={`${ThemeConfig[GlobalTheme].textColor}`}>
            {categoryData === 'loading' ? <Spinner /> :
              categoryData.blogMetadata.map((item, index) => (
                <CardListViewer
                  key={item.blog_id} // Ensuring keys are unique and correct
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
          </h3>
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