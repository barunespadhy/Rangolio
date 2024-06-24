import React, { useState } from 'react';
import { Input, Label, FormGroup, Container } from 'reactstrap';
function RangeSlider (props) {
  const [value, setValue] = useState(props.value || props.defaultValue);

  const handleChange = (e) => {
    setValue(e.target.value);
    props.setRange(e.target.value)
  };
  
  return (
    <Container className='mt-5'>
      <FormGroup>
        <Label for="rangeSlider">{props.label}: {value} pixels</Label>
        <Input
          type="range"
          name="range"
          id="rangeSlider"
          min={props.min}
          max={props.max}
          step={props.step}
          value={value}
          onChange={handleChange}
        />
      </FormGroup>
    </Container>
  );
}

export default RangeSlider;