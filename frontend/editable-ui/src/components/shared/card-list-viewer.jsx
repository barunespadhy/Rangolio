import { useState, useRef } from 'react';
import EditableMediaService from '../../services/editable-media-service'
import {
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardBody,
  Input, InputGroup, InputGroupText, FormFeedback, Button, ButtonGroup
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ModalComponent from './modal-component';

function CardListViewer(props) {

  const [nameFieldInvalid, setNameFieldInvalid] = useState(false)
  const [descriptionFieldInvalid, setDescriptionFieldInvalid] = useState(false)
  const [taglineFieldInvalid, setTaglineFieldInvalid] = useState(false)
  const [modal, setModal] = useState(false);
  const [modalText, setModalText] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);

  const toggle = () => setModal(!modal);

  const nameField = useRef(null)
  const descriptionField = useRef(null)
  const taglineField = useRef(null)

  const handleInputUpdate = (elementValue, fieldType) => {
    if (fieldType === 'nameField'){
      if (elementValue === '')
        setNameFieldInvalid(true)
      else
        setNameFieldInvalid(false)
    }
    if (fieldType === 'descriptionField'){
      if (elementValue === '')
        setDescriptionFieldInvalid(true)
      else
        setDescriptionFieldInvalid(false)
    }
    if (fieldType === 'taglineField'){
      if (elementValue === '')
        setTaglineFieldInvalid(true)
      else
        setTaglineFieldInvalid(false)
    }
    props.addToIdsToUpdate({
      'id': props.id,
      'name': nameField.current.value,
      'featuredBlog': '',
      'description': descriptionField.current.value,
      'tagLine': taglineField.current.value,
    })
  }

  const showModal = () => {
    setModalTitle('Confirm')
    setModalText('Are you sure that you wish to delete this category?')
    toggle()
  }

  const deleteResource = () => {
    props.deleteResource(props.id)
    toggle()
  }

  const itemObject = props.itemObject

  if (props.totalItems > 0 && itemObject && Object.keys(itemObject).length !== 0){
    if (props.resourceType === 'categories')
      return (
        <>
          <ModalComponent modalText={modalText} modalTitle={modalTitle} modal={modal} toggle={toggle} confirmAction={deleteResource}/>
          <Card outline className={`my-2 ${props.borderColor} ${props.bgColor}`} style={{'width': props.cardType === 'smallCard' ? '18rem': '100%'}}>
            <CardBody>
              <CardTitle className={`mb-3 ${props.textColor}`} tag='h5'>
                <InputGroup>
                  <InputGroupText>
                      Name
                  </InputGroupText>
                  <Input defaultValue={itemObject.name} invalid={nameFieldInvalid} innerRef={nameField} onChange={() => handleInputUpdate(nameField.current.value, 'nameField')}/>
                  {nameFieldInvalid ? <FormFeedback tooltip className='mt-1'>
                  This field cannot be empty
                  </FormFeedback>:''}
                </InputGroup>
              </CardTitle>
              <CardText className={`${props.textColor}`}>
                <InputGroup>
                  <InputGroupText>
                      Description
                  </InputGroupText>
                  <Input defaultValue={itemObject.description} invalid={descriptionFieldInvalid} innerRef={descriptionField} onChange={() => handleInputUpdate(descriptionField.current.value, 'descriptionField')}/>
                  {descriptionFieldInvalid ? <FormFeedback tooltip className='mt-1'>
                  This field cannot be empty
                  </FormFeedback>:''}
                </InputGroup>
              </CardText>
              <CardText>
                <small className={`${props.textColor}`}>
                  <InputGroup>
                    <InputGroupText>
                      Tagline
                    </InputGroupText>
                    <Input defaultValue={itemObject.tagLine} invalid={taglineFieldInvalid} innerRef={taglineField} onChange={() => handleInputUpdate(taglineField.current.value, 'taglineField')} />
                    {taglineFieldInvalid ? <FormFeedback tooltip className='mt-1'>
                      This field cannot be empty
                    </FormFeedback>:''}
                  </InputGroup>
                </small>
              </CardText>
              <CardText>
                <Link className={`${props.textColor}`} to={`/${props.resourceType}/${itemObject.id}`}>
                  <Button color='success'>
                    Open this resource
                  </Button>
                </Link>
                <Button color='danger' onClick={() => showModal()} className='m-2'>Delete Category</Button>
              </CardText>
            </CardBody>
          </Card>
        </>
      )
    else
      return (
        <Card outline className={`my-2  ${props.borderColor} ${props.bgColor}`} style={{'width': props.cardType === 'smallCard' ? '18rem': '100%'}}>
          {itemObject.coverImage !== '' ? <CardImg src={EditableMediaService.getMedia(itemObject.coverImage)} style={{ 'height': '180px', 'objectFit': 'cover' }} top width='100%' /> : ''}
          <CardBody>
            <Link to={`/${props.resourceType}/${itemObject.id}`}>
              <CardTitle className={`${props.textColor}`} tag='h3'>
                {itemObject.name}
              </CardTitle>
              <CardText className={`${props.textColor}`} tag='h5'>
                {itemObject.description}
              </CardText>
              <CardText tag='h6'>
                <small className={`${props.textColor}`}>
                  {itemObject.tagLine}
                </small>
              </CardText>
            </Link>
          </CardBody>
          {
            itemObject.id === props.featuredBlog ?
              <ButtonGroup>
                <Button
                  outline
                  active={itemObject.id === props.featuredBlog}
                  color={props.buttonColor}
                  onClick={() => props.updateFeaturedBlog(itemObject.id)}
                >
                  Set this as featured
                </Button>
                <Button
                  outline
                  color={props.buttonColor}
                  onClick={() => props.updateFeaturedBlog('')}
                >
                  Unset featured blog
                </Button>
              </ButtonGroup> : ''
          }
        </Card>
      )
  }
  else
    return(<h3 className={`${props.textColor}`}>No items found in this section</h3>)
}

export default CardListViewer