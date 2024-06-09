import React, { useState } from 'react';
import FileComponent from './file-component.jsx';
import MediaLister from './media-lister.jsx';
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

function MediaUpload(props) {
  
  const [action, setAction] = useState('insert')
  const toggleAction = () =>{
    if (action === 'insert')
      setAction('upload')
    if (action === 'upload')
      setAction('insert')
  }

  return (
    <div>
      <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>{props.modalTitle}</ModalHeader>
        <ModalBody>
          <ButtonGroup>
            <Button
              outline
              active={action === 'insert'}
              onClick={() => toggleAction()}
            >
              Insert Media
            </Button>
            <Button
              outline
              active={action === 'upload'}
              onClick={() => toggleAction()}
            >
              Upload Media
            </Button>
          </ButtonGroup>
          <div  className="mt-3">
            { action === 'insert' ?
              <div>
                <MediaLister setMedia={props.setMedia} notificationToggler={props.notificationToggler} resourceType={props.resourceType} resourceId={props.resourceId} />
              </div>:
              <div>
                <FileComponent notificationToggler={props.notificationToggler} resourceType={props.resourceType} resourceId={props.resourceId} />
              </div>
            }
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default MediaUpload;