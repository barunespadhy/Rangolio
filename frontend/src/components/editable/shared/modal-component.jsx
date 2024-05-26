import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function ModalComponent(props) {

  return (
    <div>
      <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>{props.modalTitle}</ModalHeader>
        <ModalBody>
          {props.modalText}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={props.confirmAction}>
            Yes
          </Button>{' '}
          <Button color="secondary" onClick={props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalComponent;