import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import EditableDataService from '../../services/editable-data-service';

function MediaLister(props) {
  const [media, setMedia] = useState([]);

  const fetchMedia = async () => {
    try {
      const response = await EditableDataService.getData(`/data/media/${props.resourceType}/${props.resourceId}/`);
      setMedia(response.data.media);
    } catch (error) {
      props.notificationToggler('Error fetching media', 'danger')
    }
  };
  
  useEffect(() => {
    fetchMedia();
  }, []);
  
  const deleteMedia = (mediaUrl) => {
    // Extract the file name from the mediaUrl
    const fileName = mediaUrl.substring(mediaUrl.lastIndexOf('/') + 1);

    EditableDataService.deleteData(`/data/media/${props.resourceType}/${props.resourceId}/?file=${fileName}`)
      .then(() => {
        props.notificationToggler('Media deleted')
        fetchMedia()
      })
      .catch(error => {
        props.notificationToggler('Error deleting media', 'danger')
      });
  };
  

  return (
    <div>
      <h4>
        Choose media to insert
      </h4>
      {media.map(image => (
        <div className={'mb-2'} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1px' }} key={image}>
          <img src={image} style={{ width: '150px', height: 'auto' }} />
          <Button color={'success'} onClick={() => props.setMedia(image)} style={{ cursor: 'pointer' }}>Upload</Button>
          <Button color={'danger'} onClick={() => deleteMedia(image)} style={{ cursor: 'pointer' }}>Remove</Button>
        </div>
      ))}
    </div>
  );
}

export default MediaLister;