import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import ThreeScene2 from './components/ThreeScene2';
import Console from './components/Console';
import "./App.css";
import MenuBar from './components/MenuBar';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { editorData: ``, codeForRun: '', consoleMessages: [] }
    this.updateCode = this.updateCode.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.manageCode = this.manageCode.bind(this);
    this.updateConsoleMessages = this.updateConsoleMessages.bind(this);
  }

  updateCode(data) {
    console.log(data);
    this.setState({ editorData: data });
  }
  updateConsoleMessages(messages) {
    console.log(messages);
    this.setState({ consoleMessages: messages });
  }

  manageCode(data) {
    console.log(data);
    this.state.editorData = data;
  }
  handleButtonClick() {
    this.setState({ codeForRun: this.state.editorData });
  }

  render() {
    return (
      <div className="App" >
        <MenuBar></MenuBar>
        <div className='mainContainer'>

          <div className='column1'>
            <div className='projectDetailsBar'>
              <button onClick={this.handleButtonClick}>RUN</button>
            </div>
            <CodeEditor manageCode={this.manageCode} />
          </div>


          <div className='column2'>

            <div className='threeContainer'>
              <ThreeScene2 code={this.state.codeForRun} updateConsoleMessages={this.updateConsoleMessages} />
            </div>

            <Console consoleMessages={this.state.consoleMessages} />
          </div>
        </div>



      </div>
    )
  };
}
