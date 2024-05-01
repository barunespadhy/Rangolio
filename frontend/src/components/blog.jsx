import { useEffect, useState } from 'react';
import DataService from '../services/data-service';
import MediaService from '../services/media-service'
import CategoryBar from './shared/category-bar';
import {
  Container,Row, Col,Spinner, UncontrolledCollapse, Button, ButtonGroup, Card, CardBody
} from 'reactstrap';
import { Link, useParams } from 'react-router-dom';

function Blog(props) {

  const { blogID } = useParams();

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    DataService.getData(`blogs/${blogID}/blog-data`).then(response =>
      setBlogData(response.data)
    );
  }, []);

  if (GlobalTheme && ThemeConfig) {
  return (
    <Container fluid className={`min-vh-82 ${ThemeConfig[GlobalTheme].background}`}>
    <CategoryBar currentPage={blogData.parentCategory} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig}/>
      <Row className="mb-4">
        <Col className="p-0">
          <img
            src={MediaService.getMedia(blogData.coverImage)}
            alt="Banner"
            style={{ width: '100%', height: 'auto', maxHeight: '20vh', objectFit: 'cover' }}
          />
        </Col>
      </Row>
      <Row className="mr-2 ml-2 mb-2 mt-1 blogContent">
        <Col xs="3" className="d-none d-md-block"></Col>
        <Col xs={`${console.log(window.screen.width) >= 765 ? '6':''}`}>
          <h1 className={`${ThemeConfig[GlobalTheme].textColor}`}>{blogData.name}</h1>
          <h4 className={`${ThemeConfig[GlobalTheme].textColor}`}>{blogData.description}</h4>
          <div>
            <Button
              color="primary"
              id="toggler"
              style={{
                marginBottom: '1rem'
              }}
            >
              Share
            </Button>
            <UncontrolledCollapse toggler="#toggler">
              <Card style={{overflowX: 'auto'}}>
                <CardBody>
                  <ButtonGroup
                    vertical
                    className="my-2"
                  >
                  <Button outline>
                    <Link to="#" onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(window.location.href).then(() => {
                        props.notificationToggler("Link copied")
                      })
                      return false;
                    }}>
                      Copy Link
                      </Link>
                    </Button>
                    <Button outline>
                    <Link to="#" onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, 'facebook-share-dialog', 'width=800,height=600');
                      return false;
                    }}>
                      Facebook
                      </Link>
                    </Button>
                    <Button outline>
                    <Link to="#" onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://www.reddit.com/submit?url=${window.location.href}&title=${blogData.name}`, 'facebook-share-dialog', 'width=800,height=600');
                      return false;
                    }}>
                      Reddit
                      </Link>
                    </Button>
                    <Button outline>
                    <Link to="#" onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20article!&url=${window.location.href}`, 'facebook-share-dialog', 'width=800,height=600');
                      return false;
                    }}>
                      X
                    </Link>
                    </Button>
                  </ButtonGroup>
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>
        </Col>
        <Col xs="3" className="d-none d-md-block"></Col>
      </Row>

      <Row className={`my-2 ${ThemeConfig[GlobalTheme].background}`}>
        <Col>
          <hr style={{"borderColor": `${ThemeConfig[GlobalTheme].borderColor}`}} />
        </Col>
      </Row>

      <Row className="mr-2 ml-2 mt-1">
      <Col xs="3" className="d-none d-md-block"></Col>

      <Col xs={`${console.log(window.screen.width) >= 765 ? '6':''}`} style={{marginBottom: '25px'}}>
        <div className={`${ThemeConfig[GlobalTheme].textColor}`} dangerouslySetInnerHTML={{ __html: blogData.contentBody }} />
        <div className={`${ThemeConfig[GlobalTheme].textColor}`} dangerouslySetInnerHTML={{ __html: blogData.contentBody }} />
        <div className={`${ThemeConfig[GlobalTheme].textColor}`} dangerouslySetInnerHTML={{ __html: blogData.contentBody }} />
      </Col>

      <Col xs="3" className="d-none d-md-block"></Col>
      </Row>
    </Container>
  );
  } else {
    return (<Spinner />)
  }
}

export default Blog 