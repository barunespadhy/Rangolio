import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card, Alert } from 'reactstrap';

function Notification(props) {
  return (
    <React.StrictMode>
      <Collapse isOpen={props.isOpen} {...props}>
        <Card>
          <CardBody>
            <Alert>{props.notificationMessage}</Alert>
          </CardBody>
        </Card>
      </Collapse>
    </React.StrictMode>
  );
}

export default Notification;