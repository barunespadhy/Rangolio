import logo from './logo.svg';
import { Button, Container, Row, Col } from "reactstrap";
import './App.css';
import DemoNavbar from './components/Navbars/DemoNavbar'

function App() {
  return (
    <div className="App">
      <DemoNavbar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Button
                    className="btn-icon btn-3 ml-1"
                    color="primary"
                    type="button"
                  >
                    <span className="btn-inner--icon mr-1">
                      <i className="ni ni-bag-17" />
                    </span>
                    <span className="btn-inner--text">With icon</span>
                    <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
                  </Button>
        
      </header>
    </div>
  );
}

export default App;
