import { Container, Spinner } from 'reactstrap';

function HomePage(props) {
  const UserData = props.UserData ? props.UserData : <Spinner> Loading... </Spinner>
  const GlobalTheme = props.GlobalTheme;
  const ThemeConfig = props.ThemeConfig;
  if (GlobalTheme && ThemeConfig) 
  return (
    <Container fluid className={`p-0 ${ThemeConfig[GlobalTheme].background}`}>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h3 className={`${ThemeConfig[GlobalTheme].textColor}`}>{`${UserData.greetingLine} ${UserData.name}`}</h3>
        <h5 className={`${ThemeConfig[GlobalTheme].textColor}`}>{`${UserData.tagLine}`}</h5>
      </div>
    </Container>
  );
}

export default HomePage;