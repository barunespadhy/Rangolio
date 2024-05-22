import { useEffect, useState } from 'react';
import MediaService from '../../../services/media-service'
import {
  Spinner,
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardBody,
  Input, InputGroup, InputGroupText
} from 'reactstrap';
import { Link } from 'react-router-dom';

function CardListViewer(props) {
  
  const itemObject = props.itemObject

  if (props.totalItems > 0 && itemObject && Object.keys(itemObject).length !== 0){
    if (props.resourceType === 'categories')
      return (
        <Card color={props.borderColor} outline className={`my-2 ${props.bgColor}`} style={{"width": props.cardType === "smallCard" ? "18rem": "100%"}}>
          {itemObject.coverImage !== "" ? <CardImg src={MediaService.getMedia(itemObject.coverImage)} style={{ "height": "180px", "objectFit": "cover" }} top width="100%" /> : ""}
          <CardBody>
            <CardTitle className={`mb-3 ${props.textColor}`} tag="h5">
              <InputGroup>
                <InputGroupText>
                    Name
                </InputGroupText>
                <Input defaultValue={itemObject.name} />
              </InputGroup>
            </CardTitle>
            <CardText className={`${props.textColor}`}>
              <InputGroup>
                <InputGroupText>
                    Description
                </InputGroupText>
                <Input defaultValue={itemObject.description} />
              </InputGroup>
            </CardText>
            <CardText>
              <small className={`${props.textColor}`}>
                <InputGroup>
                  <InputGroupText>
                    Tagline
                  </InputGroupText>
                  <Input defaultValue={itemObject.tagLine} />
                </InputGroup>
              </small>
            </CardText>
            <CardText>
            <Link className={`${props.textColor}`} to={`/${props.resourceType}/${itemObject.id}`}>
              Open this resource
            </Link>
            </CardText>
          </CardBody>
        </Card>
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