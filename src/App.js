import './App.css';
import React, { Component } from 'react';
import CreateModal from './components/CreateModal';
import TableComponent from './components/TableComponent';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Suico's Contact List</h1><br />
          <CreateModal /><br />
          <TableComponent />
        </header>
      </div>
    );
  }
}

export default App;
