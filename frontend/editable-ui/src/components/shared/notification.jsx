import React from 'react';
import { Collapse, Button, CardBody, Card, Alert } from 'reactstrap';

function Notification(props) {
  return (
    <React.StrictMode>
      <Collapse isOpen={props.isOpen} {...props}>
        <Card>
          <CardBody>
            <Alert color={props.message.color}>{props.message.message}</Alert>
          </CardBody>
        </Card>
      </Collapse>
    </React.StrictMode>
  );
}

export default Notification;