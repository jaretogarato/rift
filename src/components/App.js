import React, { Component } from 'react';
import riftLogo from '../images/rift-logo-v01.png';
import riftLogotype from '../images/rift-logotype-01.png';
import '../css/App.css';
import Main from './Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={riftLogo} className="App-logo" alt="logo" />
          <img src={riftLogo} className="App-logo-2" alt="logo" />
          <img src={riftLogotype} className="Logotype" alt="logotype" />
          {/* <h1 className="App-title">Rift</h1> */}
        </header>
        <Main />
      </div>
    );
  }
}

export default App;
