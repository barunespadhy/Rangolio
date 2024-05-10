import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

import DataService from '../../services/data-service';
import MediaService from '../../services/media-service'
import CategoryBar from './shared/category-bar';
import EditorComponent from './shared/tiptap';

import {
  Container,Row, Col,Spinner, UncontrolledCollapse, Button, ButtonGroup, Card, CardBody
} from 'reactstrap';
import { Link, useParams } from 'react-router-dom';

function Blog(props) {

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
        const newClasses = `img-fluid mt-2 mb-2 rounded`;
        const existingClasses = node.attribs.class ? `${node.attribs.class} ` : '';
        node.attribs.class = `${existingClasses}${newClasses}`;
      }
    }
  };

  useEffect(() => {
    DataService.getData(`blogs/${blogID}/blog-data`).then(response =>{
        setBlogData(response.data)
        const parsedContent = parse(response.data.contentBody, { replace });
        setBlogContent(parsedContent);
      }
    );
  }, []);

  useEffect(() => {
    if (blogData.contentBody){
      const parsedContent = parse(blogData.contentBody, { replace });
      setBlogContent(parsedContent);
    }
  }, [GlobalTheme])

  if (GlobalTheme && ThemeConfig && blogData) {
  return (
    <Container fluid className={`${ThemeConfig[GlobalTheme].background}`}>
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
                      Copy Link
                      </Link>
                    </Button>
                    <Button outline>
                    <Link className="p-3" to="#" onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, 'facebook-share-dialog', 'width=800,height=600');
                      return false;
                    }}>
                      Facebook
                      </Link>
                    </Button>
                    <Button outline>
                    <Link className="p-3" to="#" onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://www.reddit.com/submit?url=${window.location.href}&title=${blogData.name}`, 'facebook-share-dialog', 'width=800,height=600');
                      return false;
                    }}>
                      Reddit
                      </Link>
                    </Button>
                    <Button outline>
                    <Link className="p-3" to="#" onClick={(e) => {
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

        <Col className={`blogContent ${ThemeConfig[GlobalTheme].textColor}`} style={{marginBottom: '25px'}}>
          <EditorComponent content={blogData.contentBody}/>
          <ButtonGroup className='mt-4'>
            <Button outline>Save Data</Button>
            <Button outline>Publish Data</Button>
          </ButtonGroup>
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