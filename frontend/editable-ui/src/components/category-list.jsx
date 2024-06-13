import { useEffect, useState } from 'react';

//import services
import EditableDataService from '../services/editable-data-service';

//import views
import CardListViewer from './shared/card-list-viewer';

import {
  Spinner,
  Row,
  Col,
  Container,
  Card,
  CardTitle,
  CardBody,
  Button,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Blogs(props) {

  let navigate = useNavigate();
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;

  const [categoryMetadata, setCategoryMetadata] = useState([]);
  const [idsToUpdate, setIdsToUpdate] = useState({});

  useEffect(() => {
    setCategoryData()
  }, []);

  const setCategoryData = () => {
    EditableDataService.getData('/data/category/').then(response => {
      let responseData = response.data
      let localCategoryMetadata = []
      for (let eachResponse of responseData){
        localCategoryMetadata.push({
          'id': eachResponse['category_id'],
          'name': eachResponse['name'],
          'featuredBlog': eachResponse['featured_id'],
          'description': eachResponse['description'],
          'tagLine': eachResponse['tagline'],
          'coverImage': eachResponse['cover_image']
        })
      }
      setCategoryMetadata(localCategoryMetadata)
    });
  }

  const addToIdsToUpdate = (resourceObject) => {
    let localIdsToUpdate = {...idsToUpdate}
    localIdsToUpdate[resourceObject.id]={
      'name': resourceObject.name,
      'featured_blog': resourceObject.featuredBlog,
      'description': resourceObject.description,
      'tagline': resourceObject.tagLine,
      'cover_image': resourceObject.coverImage
    }
    setIdsToUpdate(localIdsToUpdate)
  }

  const deleteResource = (id) => {
    EditableDataService.deleteData(`/data/category/delete/${id}/`).then(() => {
      props.notificationToggler('Category successfully deleted')
      setCategoryData()
    }).catch(() => {
      props.notificationToggler('Failed to delete category', 'danger');
    });
  }

  const addNewCategory = () => {
    EditableDataService.createData('/data/category/create/', {
      'name': 'Enter name',
      'featured_id': '',
      'description': 'Enter description',
      'tagline': 'Enter tagline',
      'cover_image': ''
    }).then(() => {
      props.notificationToggler('Category created successfully')
      setCategoryData()}).catch(() => {
      props.notificationToggler('Failed to add category', 'danger');
    });
  }

  const updateInfo = () => {
    for (let id of Object.keys(idsToUpdate)) {
      EditableDataService.updateData(`/data/category/update/${id}/`, idsToUpdate[id]).then( () =>{
        props.notificationToggler('Category data updated successfully')
      }).catch( () => {
        props.notificationToggler('Failed to update category data', 'danger');
      });
    }
    setCategoryData()
  }

  if (GlobalTheme && ThemeConfig) {
    return (
      <Container fluid className={`p-0 mb-2 ${ThemeConfig[GlobalTheme].background}`}>
        <Col xs='3' className='d-md-block'><Button color={ThemeConfig[GlobalTheme].buttonColor} onClick={() => navigate('/')} className='ms-5 mt-5' outline><FontAwesomeIcon icon={faLeftLong}/></Button></Col>
        <Row className='justify-content-center align-items-center'>
          <Col className='d-flex flex-column align-items-center'>
            <div className='w-100'>
              <Card className={`my-2 ${ThemeConfig[GlobalTheme].background}`} style={{width: '100%', border: 'none'}}>
                <CardBody>
                  <CardTitle style={{ display: 'grid' }} className={`${ThemeConfig[GlobalTheme].textColor} justify-content-center`} tag='h1'>
                    {'Categories'}
                    <Button className='mt-2' color={ThemeConfig[GlobalTheme].buttonColor} outline onClick={() => addNewCategory()}>Add New</Button>
                  </CardTitle>
                </CardBody>
              </Card>
            </div>
            <div className='' style={{ width: '70%', margin: 'auto' }}>
              {categoryMetadata.length > 0 ? 
                categoryMetadata.map((item) => (
                  <CardListViewer 
                    key={item.id}
                    id = {item.id}
                    totalItems={categoryMetadata.length}
                    addToIdsToUpdate={addToIdsToUpdate}
                    cardType={'longCard'}
                    deleteResource={deleteResource}
                    resourceType={'categories'}
                    textColor={ThemeConfig[GlobalTheme].textColor} 
                    bgColor={ThemeConfig[GlobalTheme].background} 
                    borderColor={ThemeConfig[GlobalTheme].borderColor}
                    buttonColor={ThemeConfig[GlobalTheme].buttonColor}
                    notificationToggler={props.notificationToggler}
                    itemObject={item}
                  />
                )) : <Spinner />}
              <Button className='mt-3 mb-2' onClick={() => updateInfo()} color={ThemeConfig[GlobalTheme].buttonColor} outline>Save Data</Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return null;
  }
}

export default Blogs;
