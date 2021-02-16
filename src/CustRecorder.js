import React from 'react';
import { ReactMic } from '@cleandersonlobo/react-mic';
import { ReactMic as MReactMic } from '@matuschek/react-mic';
import {set,get} from 'idb-keyval';
import {Button,Container,Input} from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay,faStop } from '@fortawesome/free-solid-svg-icons';
 
class CustRecorder extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
          record: false,
          notes:[],
          noteName:"",
          visualStyle:"sinewave"
        }
    }
     
    initiateNotes = async() => {
        let notes = await get('notes') === undefined ? [] : await get('notes');
        this.setState(()=>({
          notes:notes,
        }));
    }

    startRecording = () => {
        this.setState({ record: true });
    }
     
    stopRecording = () => {
        this.setState({ record: false });
    }
    
    onStop = (recordedBlob) => {
        this.saveNote(recordedBlob);
    }

    saveNote = async(blob) => {
        let newNotes = this.state.notes;
        newNotes.push({"name": this.state.noteName === "" ? `new Note_${newNotes.length+1}` : this.state.noteName,"blob":blob})
        await set('notes',newNotes);
        this.setState(()=>({
            notes:newNotes,
        }));
        this.props.setNotes(this.state.notes);
    }

    setNoteName = (e) => {
      this.setState({
        noteName:e.target.value,
      });
    }
     
    toggleVisualStyle = (e) => {
      this.setState({
        visualStyle: this.state.visualStyle === "sinewave" ? "frequencyBars" : "sinewave",
      });
      this.componentDidMount();
    }

    componentDidMount(){
        console.log(`state = ${this.state.visualStyle}`);
        this.initiateNotes();
    }

    render() {
        return (
          <Container className="recorder">
            <Input placeholder={`new Note_${this.state.notes.length+1}`} onChange={this.setNoteName} size="big" className="recorder-note-name"/>
            {/* <Radio toggle onChange={this.toggleVisualStyle}/> */}
            <MReactMic
              record={this.state.record}
              className="sound-wave"
              strokeColor="#9575cd"
              visualSetting={this.state.visualStyle}
              backgroundColor="#374046"/>
            <ReactMic
              record={this.state.record}
              className="sound-wave-hidden"
              onStop={this.onStop}
              // onData={this.onData}
              // strokeColor="#ff5722"
              strokeColor="#9575cd"
              // visualSetting={this.state.visualStyle}
              mimeType="audio/mp3"
              backgroundColor="#374046"/>
            <br/>
            <div className="newControls">
              <Button onClick={this.startRecording} type="button" >
                  <FontAwesomeIcon icon={faPlay}></FontAwesomeIcon>
              </Button>
              <Button onClick={this.stopRecording} type="button">
                  <FontAwesomeIcon icon={faStop}></FontAwesomeIcon>
              </Button>
            </div>
          </Container>
        );
    }
}

export default CustRecorder;
