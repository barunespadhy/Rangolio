import React, { useState } from 'react';
import { Button, Label, Input } from 'reactstrap';
import EditableDataService from '../../services/editable-data-service';

function FileComponent(props) {
  const [file, setFile] = useState(null);
  const [resourceType, setResourceType] = useState('');
  const [resourceId, setResourceId] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);  // Assuming single file upload
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('media', file);
    formData.append('resource_type', props.resourceType);
    formData.append('resource_id', props.resourceId);

    try {
      const response = await EditableDataService.createData('/data/upload/', formData);
      props.notificationToggler('Media uploaded successfully')
    } catch (error) {
      props.notificationToggler('Media upload failed', 'danger')
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <Label for="exampleFile">
        File
      </Label>
      <Input
        id="exampleFile"
        name="file"
        type="file"
        onChange={handleFileChange}
      />
      <Button className='mt-2' type="submit">Upload</Button>
    </form>
  );
}

export default FileComponent;
