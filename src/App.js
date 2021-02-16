import React from 'react';
import CustRecorder from './CustRecorder';
import Home from './Home';
import {get} from 'idb-keyval';
import {Header} from 'semantic-ui-react';

class App extends React.Component{
  
  constructor(){
    super();
    this.state={
      // context:"new",
      context:"home",
      notes:[],
    }
  }
  
  initiateNotes = async() => {
    let notes = await get("notes") === undefined ? [] : await get("notes");
    this.setState(()=>({
      notes:notes,
    }));
  }

  setNotes = (notes) => {
    this.setState(()=>({
      notes:notes
    }));
    this.setContextHome();
  }

  setContextHome = () => {
    this.setState(()=>({
      context:"home",
    }));
  }

  setContextNew = () => {
    this.setState(()=>({
      context:"new",
    }));
  }

  componentDidMount(){
    this.initiateNotes();
  }

  render(){
    if(this.state.context==="home"){
      return(
        <div>
          <Header as="h1" className="appName">
          <span role="img" aria-label="app icon">  🎙️ </span>
          Voice Notes</Header>
          <Home key="01" setContextNew={this.setContextNew} setNotes={this.setNotes}/>
        </div>
      );
    }
    else if(this.state.context==="new"){
      return (
        <CustRecorder setNotes={this.setNotes} notes={this.state.notes}/>
      );
    }
  }
}

export default App;
