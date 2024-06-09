import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

import DataService from '../services/data-service';
import MediaService from '../services/media-service'
import CategoryBar from './shared/category-bar';

import {
  Container,Row, Col,Spinner, UncontrolledCollapse, Button, ButtonGroup, Card, CardBody
} from 'reactstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faReddit, faXTwitter } from '@fortawesome/free-brands-svg-icons';

function Blog(props) {

  let navigate = useNavigate();
  const { blogID } = useParams();

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [blogData, setBlogData] = useState([]);
  const [blogContent, setBlogContent] = useState()

  const replace = (node) => {
    if (node.type === 'tag') {
      if (node.name === 'a') {
        const newClasses = `${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`;
        const existingClasses = node.attribs.class ? `${node.attribs.class} ` : '';
        node.attribs.class = `${existingClasses}${newClasses}`;
        node.attribs.rel = 'noopener noreferrer';
        node.attribs.target = '_blank';
      }
      if (node.name === 'img') {
        const newClasses = `img-fluid mt-2 mb-2 rounded mx-auto d-block`;
        const existingClasses = node.attribs.class ? `${node.attribs.class} ` : '';
        node.attribs.class = `${existingClasses}${newClasses}`;
      }
    }
  };

  useEffect(() => {
    DataService.getData(`blog/${blogID}/blog-data`).then(response =>{
        setBlogData(response.data)
        const parsedContent = parse(response.data.contentBody, { replace });
        setBlogContent(parsedContent);
        document.title = response.data.name
      }
    );
  }, []);

  useEffect(() => {
    if (blogData.contentBody){
      const parsedContent = parse(blogData.contentBody, { replace });
      setBlogContent(parsedContent);
    }
  }, [GlobalTheme])

  if (GlobalTheme && ThemeConfig) {
  return (
    <Container fluid className={`${ThemeConfig[GlobalTheme].background}`}>
      <Col xs="3" className="d-none d-md-block"><Button color={ThemeConfig[GlobalTheme].buttonColor} onClick={() => navigate(`/categories/${blogData.parentCategory}`)} className="ms-5 mt-5" outline><FontAwesomeIcon icon={faLeftLong}/></Button></Col>
      <CategoryBar currentPage={blogData.parentCategory} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig}/>
      <Row className="mb-4">
        <Col className="p-0">
          {
            blogData.coverImage ?
            <img
              src={MediaService.getMedia(blogData.coverImage)}
              alt="Banner"
              style={{ width: '100%', height: 'auto', maxHeight: '20vh', objectFit: 'cover' }}
            />:""
          }
        </Col>
      </Row>
      <Row className="mr-2 ml-2 mb-2 mt-1 blogContent">
        <Col xs="3" className="d-none d-md-block"></Col>
        <Col xs={`${window.screen.width >= 765 ? '6':''}`}>
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
                    <Link className="p-3" to="#" onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(window.location.href).then(() => {
                        props.notificationToggler("Link copied")
                      })
                      return false;
                    }}>
                      <FontAwesomeIcon icon={faCopy}/> Copy Link
                      </Link>
                    </Button>
                    <Button outline>
                    <Link className="p-3" to="#" onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, 'facebook-share-dialog', 'width=800,height=600');
                      return false;
                    }}>
                      <FontAwesomeIcon icon={faFacebook}/> Facebook
                      </Link>
                    </Button>
                    <Button outline>
                    <Link className="p-3" to="#" onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://www.reddit.com/submit?url=${window.location.href}&title=${blogData.name}`, 'facebook-share-dialog', 'width=800,height=600');
                      return false;
                    }}>
                      <FontAwesomeIcon icon={faReddit}/> Reddit
                      </Link>
                    </Button>
                    <Button outline>
                    <Link className="p-3" to="#" onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20article!&url=${window.location.href}`, 'facebook-share-dialog', 'width=800,height=600');
                      return false;
                    }}>
                      <FontAwesomeIcon icon={faXTwitter}/>
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
        <Col style={{marginBottom: '25px'}}>
          <div className={`blogContent ${ThemeConfig[GlobalTheme].textColor}`}>{blogContent}</div>
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