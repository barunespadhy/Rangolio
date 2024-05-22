import { useEffect, useState, useRef } from 'react';

import DataService from '../../services/data-service';
import MediaService from '../../services/media-service'
import CategoryBar from './shared/category-bar';
import EditorComponent from './shared/tiptap';

import {
  Container,Row, Col,Spinner, UncontrolledCollapse, Button, ButtonGroup, Card, CardBody, Input, InputGroup, InputGroupText
} from 'reactstrap';
import { Link, useParams } from 'react-router-dom';

function Blog(props) {

  const nameField = useRef(null);
  const descriptionField = useRef(null);
  const tagLineField = useRef(null);

  const { blogID } = useParams();

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [blogData, setBlogData] = useState([]);
  const [blogContent, setBlogContent] = useState();

  const setInfo = (event) => {
    let localEditedBlogData = {...blogData};
    localEditedBlogData["name"] = nameField.current.value;
    localEditedBlogData["description"] = descriptionField.current.value;
    localEditedBlogData["tagLine"] = tagLineField.current.value;
    localEditedBlogData["contentBody"] = blogContent
    setBlogData(localEditedBlogData);
    props.notificationToggler('Data saved!');
  }

  useEffect(() => {
    DataService.getData(`blog/${blogID}/blog-data`).then(response =>{
        setBlogData(response.data)
        setBlogContent(response.data.contentBody)
      }
    );
  }, []);

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
          <InputGroup className="mb-3">
            <InputGroupText>
                Name
            </InputGroupText>
            <Input innerRef={nameField} defaultValue={blogData.name} />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroupText>
                Description
            </InputGroupText>
            <Input innerRef={descriptionField} defaultValue={blogData.description} />
          </InputGroup>
          <InputGroup>
            <InputGroupText>
                Tagline
            </InputGroupText>
            <Input innerRef={tagLineField} defaultValue={blogData.tagLine} />
          </InputGroup>
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
          <EditorComponent setContent={setBlogContent} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig} content={blogData.contentBody}/>
          <ButtonGroup className='mt-4'>
            <Button onClick={(event) => setInfo(event)} color={ThemeConfig[GlobalTheme].buttonColor} outline>Save Data</Button>
            <Button color={ThemeConfig[GlobalTheme].buttonColor} outline>Publish Data</Button>
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