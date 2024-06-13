import React from 'react';
import { Collapse, CardBody, Card, Alert } from 'reactstrap';

function Notification(props) {
  return (
    <React.StrictMode>
      <Collapse isOpen={props.isOpen} {...props}>
        <Card>
          <CardBody>
            <Alert>{props.message}</Alert>
          </CardBody>
        </Card>
      </Collapse>
    </React.StrictMode>
  );
}

export default Notification;