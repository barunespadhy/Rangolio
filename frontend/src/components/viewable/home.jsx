import { Container, Spinner } from 'reactstrap';
import parse from 'html-react-parser';
import MediaService from '../../services/media-service'

function HomePage(props) {
  
  const replace = (node) => {
    if (node.type === 'tag') {
      if (node.name === 'a') {
        const newClasses = `${ThemeConfig[GlobalTheme].linkBackground} ${ThemeConfig[GlobalTheme].linkTextColor}`;
        const existingClasses = node.attribs.class ? `${node.attribs.class} ` : '';
        node.attribs.class = `${existingClasses}${newClasses}`;
        node.attribs.rel = 'noopener noreferrer';
        node.attribs.target = '_blank';
      }
      if (node.name === 'img') {
        const newClasses = `img-fluid mt-2 mb-2 rounded`;
        const existingClasses = node.attribs.class ? `${node.attribs.class} ` : '';
        node.attribs.class = `${existingClasses}${newClasses}`;
      }
    }
  };

  const UserData = props.UserData ? props.UserData : <Spinner> Loading... </Spinner>
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  const introContent = props.UserData ? parse(props.UserData.introContent, { replace }) : ""

  if (GlobalTheme && ThemeConfig) 
  return (
    <Container fluid className={`p-0 mt-5 ${ThemeConfig[GlobalTheme].background}`}>
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-82">
      {UserData.profilePhoto !== "" ? <img style={{ width: '180px', height: '180px', objectFit: 'cover' }} className="rounded-circle" src={MediaService.getMedia(UserData.profilePhoto)} /> : ""}
        <div className={`mt-5 ${ThemeConfig[GlobalTheme].textColor}`}>
          <>
            <div className={`blogContent ${ThemeConfig[GlobalTheme].textColor}`}>{introContent}</div>
          </>
        </div>
      </div>
    </Container>
  );
}

export default HomePage;