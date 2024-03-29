import { Container, Spinner } from 'reactstrap';
import MediaService from '../../services/media-service'

function HomePage(props) {
  const UserData = props.UserData ? props.UserData : <Spinner> Loading... </Spinner>
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  if (GlobalTheme && ThemeConfig) 
  return (
    <Container fluid className={`p-0 ${ThemeConfig[GlobalTheme].background}`}>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      {UserData.profilePhoto !== "" ? <img style={{ width: '180px', height: '180px' }} className="rounded-circle" src={MediaService.getMedia(UserData.profilePhoto)} /> : ""}
        <h3 className={`${ThemeConfig[GlobalTheme].textColor}`}>
          <center>
            {`${UserData.greetingLine} ${UserData.name}`}
          </center>
        </h3>
        <h5 className={`${ThemeConfig[GlobalTheme].textColor}`}>
          <center>
          {`${UserData.tagLine}`}
          </center>
        </h5>
      </div>
    </Container>
  );
}

export default HomePage;