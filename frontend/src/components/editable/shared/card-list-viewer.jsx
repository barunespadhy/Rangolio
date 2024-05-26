import { useEffect, useState, useRef } from 'react';
import MediaService from '../../../services/media-service'
import {
  Spinner,
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardBody,
  Input, InputGroup, InputGroupText, FormFeedback, Button
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
      "id": props.id,
      "name": nameField.current.value,
      "featuredBlog": "",
      "description": descriptionField.current.value,
      "tagLine": taglineField.current.value,
      "coverImage": ""
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
        <Card color={props.borderColor} outline className={`my-2 ${props.bgColor}`} style={{"width": props.cardType === "smallCard" ? "18rem": "100%"}}>
          {itemObject.coverImage !== "" ? <CardImg src={MediaService.getMedia(itemObject.coverImage)} style={{ "height": "180px", "objectFit": "cover" }} top width="100%" /> : ""}
          <CardBody>
            <CardTitle className={`mb-3 ${props.textColor}`} tag="h5">
              <InputGroup>
                <InputGroupText>
                    Name
                </InputGroupText>
                <Input defaultValue={itemObject.name} invalid={nameFieldInvalid} innerRef={nameField} onChange={() => handleInputUpdate(nameField.current.value, 'nameField')}/>
                {nameFieldInvalid ? <FormFeedback tooltip className="mt-1">
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
                {descriptionFieldInvalid ? <FormFeedback tooltip className="mt-1">
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
                  {taglineFieldInvalid ? <FormFeedback tooltip className="mt-1">
                This field cannot be empty
              </FormFeedback>:''}
                </InputGroup>
              </small>
            </CardText>
            <CardText>
            <Link className={`${props.textColor}`} to={`/${props.resourceType}/${itemObject.id}`}>
              Open this resource
            </Link>
            <Button color={props.buttonColor} onClick={() => showModal()} outline className="m-1">Delete</Button>
            </CardText>
          </CardBody>
        </Card>
        </>
      )
    else
      return (
        <Card color={props.borderColor} outline className={`my-2 ${props.bgColor}`} style={{"width": props.cardType === "smallCard" ? "18rem": "100%"}}>
          {itemObject.coverImage !== "" ? <CardImg src={MediaService.getMedia(itemObject.coverImage)} style={{ "height": "180px", "objectFit": "cover" }} top width="100%" /> : ""}
          <CardBody>
            <Link to={`/${props.resourceType}/${itemObject.id}`}>
            <CardTitle className={`${props.textColor}`} tag="h5">
              {itemObject.name}
            </CardTitle>
            <CardText className={`${props.textColor}`}>
              {itemObject.description}
            </CardText>
            <CardText>
              <small className={`${props.textColor}`}>
                  {itemObject.tagLine}
              </small>
            </CardText>
            </Link>
          </CardBody>
        </Card>
      )
  }
  else
    return(<h3 className={`${props.textColor}`}>No items found in this section</h3>)
  }

export default CardListViewer