import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EditableDataService from '../../services/editable-data-service';

function Publish(props) {
    const [publishMethods, setPublishMethods] = useState(null)
    
    useEffect(() => {
        fetchPublishMethods()
    }, [])
    
    const fetchPublishMethods = async () => {
        try {
            const response = await EditableDataService.getData('/data/publish/methods/');
            let publishMethods = []
            Object.entries(response.data).map(([key, value]) => (
                publishMethods.push({
                    "key_name": key,
                    "name": value["name"]
                })
            ))
            console.log(publishMethods)
            setPublishMethods(publishMethods)
        } catch (error) {
            props.notificationToggler('Error fetching methods', 'danger')
        }
    };
    
    const publishData = async (deploy_method) => {
        try {
            const response = await EditableDataService.getData(`/data/publish/${deploy_method}/`);
            props.notificationToggler('Deployment Sucess')
        } catch (error) {
            props.notificationToggler('Deployment Failed', 'danger')
        }
    };
    
    return (
        <div>
            <Modal isOpen={props.modal} toggle={props.toggle}>
                <ModalHeader toggle={props.toggle}>Publish Website</ModalHeader>
                <ModalBody>
                    <h4>
                        Select a publish method
                    </h4>
                    {
                        publishMethods ?
                            publishMethods.map((item) => 
                                <div className='mb-3'>
                                    <Button
                                        key={item.key_name}
                                        color='danger'
                                        onClick={() => publishData(item.key_name)}
                                    >
                                        {item.name}
                                    </Button>
                                </div>
                            ):""
                    }
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

export default Publish;