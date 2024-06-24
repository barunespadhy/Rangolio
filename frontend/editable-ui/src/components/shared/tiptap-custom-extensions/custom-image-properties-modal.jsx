import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Input } from 'reactstrap';
import RangeSlider from './range-slider.jsx';
import { useRef } from 'react';

function CustomImagePropertiesModal(props) {
  
  const altField = useRef(null)
  
  return (
    <div>
      <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>Change Image Properties</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupText>
              Image Alt Text
            </InputGroupText>
            <Input innerRef={altField} defaultValue={props.alt} onChange={() => props.setAlt(altField.current.value)} />
            <RangeSlider setRange={props.setHeight} min={0} max={1000} step={1} defaultValue={300} value={props.height} label="Select Height" />
            <RangeSlider setRange={props.setWidth} min={0} max={1000} step={1} defaultValue={300} value={props.width} label="Select Width" />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={props.toggle}>
              Ok
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
  
}
  
export default CustomImagePropertiesModal;
