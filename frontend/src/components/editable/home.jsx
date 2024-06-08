import { Container, Spinner, Input, InputGroup, InputGroupText, Button, ButtonGroup, FormFeedback, Row, Col } from 'reactstrap';
import {useEffect, useState, useRef} from 'react';
import EditorComponent from './shared/tiptap';
import MediaUpload from './shared/media-upload'
import EditableMediaService from '../../services/editable-media-service'

function HomePage(props) {
  const [introContent, setIntroContent] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(false)
  const [nameFieldInvalid, setNameFieldInvalid] = useState(false)
  const [modal, setModal] = useState(false)
  const nameField = useRef(null)
  const UserData = props.UserData ? props.UserData : <Spinner> Loading... </Spinner>
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const setInfo = async () => {
    let response = await props.setInfo('/data/shared/update/user-data/', {
      "name": nameField.current.value,
      "intro_content": introContent,
      "profile_photo": profilePhoto ? profilePhoto !== '-' ? profilePhoto : '' : UserData.profilePhoto
    })
    console.log(response)
    if (response === 200)
      props.notificationToggler("Data saved successfully!")
    if ([500, 404, 403, 400].includes(response))
      props.notificationToggler("Something failed!", "danger")
  }

  const toggle = () => {setModal(!modal)}

  const showError = (elementValue, fieldType) => {
    console.log(elementValue)
    if (fieldType === 'nameField'){
      if (elementValue === '')
        setNameFieldInvalid(true)
      else
        setNameFieldInvalid(false)
    }
  }

  useEffect(() => {
    setIntroContent(UserData.introContent)
  }, [UserData])

  useEffect(() => {
    if (profilePhoto){
      setInfo()
      if (profilePhoto !== '-') toggle()
    }
  }, [profilePhoto])

  if (GlobalTheme && ThemeConfig)
    return (
      <Container fluid className={`${ThemeConfig[GlobalTheme].textColor} ${ThemeConfig[GlobalTheme].background}`}>
        <MediaUpload setMedia={setProfilePhoto} notificationToggler={props.notificationToggler} modal={modal} toggle={toggle} resourceType='homepage' resourceId='homepage' />
        <Row className="mb-4">
          <Col xs="3" className="d-none d-md-block"></Col>
          <Col className="p-0">
            <Row className='d-md-block'>
              <Col xs="4" className="d-none d-md-block"></Col>
              {UserData.profilePhoto !== "" && (
                <center><img style={{ width: '180px', height: '180px', objectFit: 'cover' }} className="mt-5 mb-2 rounded-circle" src={EditableMediaService.getMedia(UserData.profilePhoto)} alt="Profile Photo" /></center>
              )}
            <Col xs="4" className="d-none d-md-block"></Col>
            </Row>
            <Row>
            <ButtonGroup className='mt-4'>
              <Button
                outline
                color={ThemeConfig[GlobalTheme].buttonColor}
                onClick={() => toggle()}
              >
                Set Profile Photo
              </Button>
              <Button
                outline
                color={ThemeConfig[GlobalTheme].buttonColor}
                onClick={() => setProfilePhoto('-')}
              >
                Remove Profile Photo
              </Button>
            </ButtonGroup>
            </Row>
          </Col>
          <Col xs="3" className="d-none d-md-block"></Col>
        </Row>
        <Row className="mr-2 ml-2 mb-2 mt-1 blogContent">
          <Col xs="3" className="d-none d-md-block"></Col>
          <Col md="6" xs="12">
            <InputGroup className='mb-5'>
              <InputGroupText>Name</InputGroupText>
              <Input invalid={nameFieldInvalid} innerRef={nameField} defaultValue={UserData.name} onChange={() => showError(nameField.current.value, 'nameField')}/>
              {nameFieldInvalid && <FormFeedback tooltip className="mt-1">
                This field cannot be empty
              </FormFeedback>}
            </InputGroup>
            <EditorComponent notificationToggler={props.notificationToggler} GlobalTheme={GlobalTheme} ThemeConfig={ThemeConfig} content={UserData.introContent} setContent={setIntroContent} resourceType='homepage' resourceId='homepage' />
            <Button className='mt-3 mb-2' onClick={() => setInfo()} color={ThemeConfig[GlobalTheme].buttonColor} outline>Save Data</Button>
          </Col>
          <Col xs="3" className="d-none d-md-block"></Col>

        </Row>

      </Container>
    );
}

export default HomePage;