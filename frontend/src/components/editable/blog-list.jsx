import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import EditableDataService from '../../services/editable-data-service';
import CardListViewer from './shared/card-list-viewer';
import CategoryBar from './shared/category-bar';
import {
  Spinner,
  Container,
  Card,
  Row,
  Col,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardBody
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditableMediaService from "../../services/editable-media-service.jsx";

function BlogList(props) {

  const { categoryID } = useParams();
  let navigate = useNavigate();

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [categoryData, setCategoryData] = useState('loading');

  const loadBlogs = () => {
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
  }

  useEffect(() => {
    loadBlogs()
  }, [categoryID]);

  const addNewBlog = () => {
    EditableDataService.createData(`/data/blog/create/`, {
        "name": "Enter a blog name",
        "description": "Enter a description",
        "tagline": "Enter a tagline",
        "cover_image": "",
        "content_body": "<p></p>",
        "parent_category": categoryID
      }).then(response => {
        props.notificationToggler("New blog created")
        loadBlogs()
      }).catch(error => {
        props.notificationToggler('Failed to add a new blog', 'danger');
      });
  }

  const updateFeaturedBlog = (featuredId) => {
    EditableDataService.updateData(`/data/category/update/${categoryID}/`, {"featured_id": featuredId}).then(response=>{
      if (featuredId)
        props.notificationToggler('Blog set as featured')
      else props.notificationToggler('Featured blog removed')
      loadBlogs()
    })
  }

  if (GlobalTheme && ThemeConfig) {
return (
  <Container fluid className={`mb-2 p-0 ${ThemeConfig[GlobalTheme].background}`}>
    <Col xs="3" className="d-none d-md-block"><Button color={ThemeConfig[GlobalTheme].buttonColor} onClick={() => navigate(`/categories/`)} className="ms-5" outline><FontAwesomeIcon icon={faLeftLong}/></Button></Col>
    <CategoryBar currentPage={categoryID} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig} />
    <Row className="justify-content-center align-items-center">
      <Col className="d-flex flex-column align-items-center">
        <div className="w-100">
          <Card className={`my-2 ${ThemeConfig[GlobalTheme].background}`} style={{ width: "100%", border: "none" }}>
            <CardBody>
              <CardTitle style={{ display: "grid" }} className={`${ThemeConfig[GlobalTheme].textColor} justify-content-center`} tag="h1">
                {`Blogs in ${categoryData.name}`}
                <Button className='mt-2' color={ThemeConfig[GlobalTheme].buttonColor} outline onClick={() => addNewBlog()}>Add New</Button>
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
                  featuredBlog={categoryData.featuredBlog}
                  updateFeaturedBlog={updateFeaturedBlog}
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