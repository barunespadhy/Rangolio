import { useEffect, useState, useRef } from 'react';

import EditableDataService from '../services/editable-data-service';
import EditableMediaService from '../services/editable-media-service'
import CategoryBar from './shared/category-bar';
import EditorComponent from './shared/tiptap';
import ModalComponent from './shared/modal-component';
import MediaUpload from './shared/media-upload'

import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Container,Row, Col,Spinner, Button, ButtonGroup, Input, InputGroup, InputGroupText
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';

function Blog(props) {

  let navigate = useNavigate();

  const nameField = useRef(null);
  const descriptionField = useRef(null);
  const tagLineField = useRef(null);

  const { blogID } = useParams();

  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [blogData, setBlogData] = useState([]);
  const [blogContent, setBlogContent] = useState();
  const [coverImage, setCoverImage] = useState(false)
  const [modal, setModal] = useState(false);
  const [modalText, setModalText] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);
  const [fileModal, setFileModal] = useState(false);

  const toggle = () => setModal(!modal);
  const toggleFileModal = () => setFileModal(!fileModal);

  const setInfo = () => {
    EditableDataService.updateData(`/data/blog/update/${blogID}/`,{
      'name': nameField.current.value,
      'description': descriptionField.current.value,
      'tagline': tagLineField.current.value,
      'content_body': blogContent,
      'cover_image': coverImage ? coverImage !== '-' ? coverImage : '' : blogData.coverImage
    }).then(() => {
      props.notificationToggler('Blog data saved!');
      getInfo()
    }).catch(() => {
      props.notificationToggler('Failed to update blog!', 'danger');
    });
  }

  const showModal = () => {
    setModalTitle('Confirm')
    setModalText('Are you sure that you wish to delete this blog?')
    toggle()
  }

  const setCoverImageWidth = () => {
    EditableDataService.updateData(`/data/blog/update/${blogID}/`,{
      'full_width_cover_image': !blogData.fullWidthCoverImage
    }).then(() => {
      props.notificationToggler('Blog data saved!');
      getInfo()
    }).catch(() => {
      props.notificationToggler('Failed to update blog!', 'danger');
    });
  }

  const deleteResource = () => {
    EditableDataService.deleteData(`/data/blog/delete/${blogData.id}/`).then(() => {
      props.notificationToggler('Blog successfully deleted')
      navigate(`/categories/${blogData.parentCategory}`);
    }).catch(() => {
      props.notificationToggler('Failed to delete blog', 'danger');
    });
    toggle()
  }

  const getInfo = () => {
    EditableDataService.getData(`/data/blog/${blogID}/`).then(response => {
      let responseData = response.data
      setBlogData({
        'id': responseData['blog_id'],
        'name': responseData['name'],
        'description': responseData['description'],
        'tagLine': responseData['tagline'],
        'coverImage': responseData['cover_image'],
        'fullWidthCoverImage': responseData['full_width_cover_image'],
        'parentCategory': responseData['parent_category']
      })
      setBlogContent(responseData['content_body'])
    });
  }

  useEffect(() => {
    getInfo()
  }, []);

  useEffect(() => {
    if (coverImage){
      setInfo()
      if (coverImage !== '-') toggleFileModal()
    }
  }, [coverImage])

  if (GlobalTheme && ThemeConfig && blogData) {
    return (
      <Container fluid className={`${ThemeConfig[GlobalTheme].background}`}>
        <ModalComponent modalText={modalText} modalTitle={modalTitle} modal={modal} toggle={toggle} confirmAction={deleteResource}/>
        <MediaUpload setMedia={setCoverImage} notificationToggler={props.notificationToggler} modal={fileModal} toggle={toggleFileModal} resourceType='blog' resourceId={blogData.id}></MediaUpload>
        <Col xs='3' className='d-md-block'><Button color={ThemeConfig[GlobalTheme].buttonColor} onClick={() => navigate(`/categories/${blogData.parentCategory}`)} className='ms-5 mt-5' outline><FontAwesomeIcon icon={faLeftLong}/></Button></Col>
        <CategoryBar currentPage={blogData.parentCategory} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig}/>
        <Row className='mb-4'>
          <Col className='p-0'>
            {
              blogData.coverImage !== '' ?
                <img
                  src={EditableMediaService.getMedia(blogData.coverImage)}
                  alt='Banner'
                  className={`rounded ${blogData.fullWidthCoverImage ? '' : 'mx-auto d-block'}`}
                  style={{ width: blogData.fullWidthCoverImage ? '100%' : 'auto', height: 'auto', maxHeight: '50vh', objectFit: 'cover' }}
                />:''
            }
          </Col>
        </Row>
        <Row className='mr-2 ml-2 mb-2 mt-1 blogContent'>
          <Col xs='3' className='d-none d-md-block'></Col>
          <Col xs={`${window.screen.width >= 765 ? '6':''}`}>
            <Button color='danger' onClick={() => showModal()} className='mb-5'>Delete Blog</Button>
            <ButtonGroup className='mb-5 ms-5'>
              <Button
                outline
                color={ThemeConfig[GlobalTheme].buttonColor}
                onClick={() => toggleFileModal()}
              >
              Set Cover Image
              </Button>
              <Button
                outline
                color={ThemeConfig[GlobalTheme].buttonColor}
                onClick={() => setCoverImage('-')}
              >
              Remove Cover Image
              </Button>
            </ButtonGroup>
            <Button outline active={blogData.fullWidthCoverImage} color={ThemeConfig[GlobalTheme].buttonColor} onClick={() => setCoverImageWidth()} className='mb-5 ms-3'>
            Full Width Image: {blogData.fullWidthCoverImage ? 'Yes' : 'No'}
            </Button>
            <InputGroup className='mb-3'>
              <InputGroupText>Name</InputGroupText>
              <Input innerRef={nameField} defaultValue={blogData.name} />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroupText>Description</InputGroupText>
              <Input innerRef={descriptionField} defaultValue={blogData.description} />
            </InputGroup>
            <InputGroup>
              <InputGroupText>Tagline</InputGroupText>
              <Input innerRef={tagLineField} defaultValue={blogData.tagLine} />
            </InputGroup>
          </Col>
          <Col xs='3' className='d-none d-md-block'></Col>
        </Row>
        <Row className={`my-2 ${ThemeConfig[GlobalTheme].background}`}>
          <Col>
            <hr style={{'borderColor': `${ThemeConfig[GlobalTheme].borderColor}`}} />
          </Col>
        </Row>
        <Row className='mr-2 ml-2 mt-1'>
          <Col xs='3' className='d-none d-md-block'></Col>
          <Col className={`blogContent ${ThemeConfig[GlobalTheme].textColor}`} style={{marginBottom: '25px'}}>
            <EditorComponent notificationToggler={props.notificationToggler} setContent={setBlogContent} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig} content={blogContent} resourceType='blog' resourceId={blogData.id}/>
            <Button className='mt-3 mb-2' onClick={(event) => setInfo(event)} color={ThemeConfig[GlobalTheme].buttonColor} outline>Save Data</Button>
          </Col>
          <Col xs='3' className='d-none d-md-block'></Col>
        </Row>
      </Container>
    );
  } else {
    return (<Spinner />)
  }
}

export default Blog 