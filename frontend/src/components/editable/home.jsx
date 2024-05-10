import { Container, Spinner, Input, InputGroup, InputGroupText, Button, ButtonGroup } from 'reactstrap';
import EditorComponent from './shared/tiptap';
import MediaService from '../../services/media-service'

function HomePage(props) {
  const UserData = props.UserData ? props.UserData : <Spinner> Loading... </Spinner>
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  if (GlobalTheme && ThemeConfig) 
  return (
    <Container fluid className={`p-0 mt-5 ${ThemeConfig[GlobalTheme].background}`}>
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-82">
      {UserData.profilePhoto !== "" ? <img style={{ width: '180px', height: '180px', objectFit: 'cover' }} className="rounded-circle" src={MediaService.getMedia(UserData.profilePhoto)} /> : ""}
        <div className={`mt-5 ${ThemeConfig[GlobalTheme].textColor}`}>
          <>
            <InputGroup className='mb-5'>
              <InputGroupText>
                Name
              </InputGroupText>
              <Input defaultValue={UserData.name} />
            </InputGroup>
            <EditorComponent content={UserData.introContent}/>
          </>
          <ButtonGroup className='mt-4'>
            <Button outline>Save Data</Button>
            <Button outline>Publish Data</Button>
          </ButtonGroup>
        </div>
      </div>
    </Container>
  );
}

export default HomePage;