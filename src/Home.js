import React from 'react';
import {get, set} from 'idb-keyval';
import {Button,Container,Divider,Card,Modal,Input,Header} from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faTools } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component{
    constructor(){
        super();
        this.state={
            notes:[],
            open:false,
            openUnsupported:false,
            toChangeNote:"",
            changeNoteTo:"",
        }
    }
    
    checkSupport = () =>{
        let userAgent = navigator.userAgent;
        if((window.screen.height<840 && window.screen.width<1200) || !(/chrome/i.test(userAgent))){
            this.setState({openUnsupported:true});
            // console.log(JSON.stringify(this.state));
        }
    }

    initiateNotes = async() => {
        let notes = await get("notes") === undefined ? [] : await get("notes");
        this.setState(()=>({
            notes:notes,
        }));
    }

    upload = async(e) => {
        e.persist();
        const blob=e.target.dataset.blob;
        const user=e.target.dataset.user;
        const name=e.target.dataset.name;

        const form = new FormData();
        form.append("blob",blob);
        form.append("user",user);
        form.append("name",name);

        const response = await fetch('http://localhost:5000/addnote', {
            method: 'POST',
            headers: { 
                        'Access-Control-Allow-Origin': "*"
            },
            body: form,
        }).then(e=>console.log(`fetch reponse = ${e.json()}`))
        .catch(e=>console.log("fetch error"))
        .then(e=>console.log(`fetch success = ${e}`));

        // console.log(`fetch reponse = ${JSON.stringify(response)}`);

    }

    deleteNote = (e) => {
        e.persist();
        let tmp = this.state.notes.filter(i=> i.name.toString() !== e.target.dataset.name.toString());
        this.setState(()=>({
            notes:tmp,
        }));
        set("notes",tmp);
        this.props.setNotes(tmp);
    }

    setToChangeNote = (e) => {
        this.setState({
            toChangeNote:e.target.dataset.name,
            open:true,
        })
    }

    setChangeNoteTo = (e) => {
        this.setState({
            changeNoteTo:e.target.value,
        })
    }

    updateNoteName = async() => {
        let notes = this.state.notes;
        if(this.state.changeNoteTo){
            let toChangeIndex = notes.findIndex( i => i.name.toString() === this.state.toChangeNote );
            notes[toChangeIndex].name = this.state.changeNoteTo;
            this.setState({
                notes:notes,
            });
            await set('notes',notes);
        }
        this.setState({open:false});
    }
    
    componentDidMount(){
        this.initiateNotes();
        // console.log(`notes = ${}`);
        this.checkSupport();
    }

    render(){
        if(this.state.notes.length !== 0){
            // this.state.notes.forEach(i=>console.log(i.blob));
            let tmp = this.state.notes.map((i,key) =>{
                return(
                <Card centered className="note">
                    <Card.Header>
                        <h1>{i.name}</h1>
                    </Card.Header>
                    <Card.Content>
                        <audio controls src={URL.createObjectURL(i.blob.blob)} data-filename={i.name} key={key}></audio><br/>
                        <hr/>
                        <Button type="button" data-name={i.name} onClick={this.deleteNote} color="red">Delete</Button>
                        <Button type="button" data-name={i.name} onClick={this.setToChangeNote}>Edit</Button>
                    </Card.Content>
                    {/* <button type="button" onClick={this.upload} data-blob={i.blob.blob} data-user={"admin"} data-name={i.name}>Upload</button> */}
                </Card>);
            });

            // tmp.push(<Button type="button" onClick={this.props.setContextNew} key="03">New</Button>);
            return(
                <div>
                <Container centered="true" className="homeCards">
                    <Card.Group>
                        {[...tmp]}
                        <Divider/>
                        <div className="createNewButtonContainer">
                            <Button type="button" className="createNewButton" onClick={this.props.setContextNew} key="03" size="huge" color="green">New &nbsp;
                                {/* <FontAwesomeIcon icon={faPlus}/> */}
                            </Button>
                        </div>
                    </Card.Group>
                </Container>
                <Modal
                onClose={() => this.setState({open:false})}
                onOpen={() => this.setState({open:true})}
                open={this.state.open}
                size="mini"
                dimmer="blurring"
                // trigger={<Button>Show Modal</Button>}
                >
                    <Modal.Header>
                        <h3>Edit note title</h3>
                    </Modal.Header>
                    <Modal.Content>
                        <center>
                            <Input placeholder={this.state.toChangeNote} size="huge" onChange={this.setChangeNoteTo}></Input>
                        </center>
                    </Modal.Content>
                    <Modal.Actions>
                    <Button
                        content="Save"
                        icon='checkmark'
                        onClick={this.updateNoteName}
                        positive
                    />
                    </Modal.Actions>
              </Modal>
              <Modal
                basic
                onClose={() => this.setState({openUnsupported:false})}
                onOpen={() => this.setState({openUnsupported:true})}
                open={this.state.openUnsupported}
                size='small'
                dimmer="blurring"
                // trigger={<Button>Basic Modal</Button>}
                >
                <Header icon>
                    <FontAwesomeIcon icon={faTools} size="4x"/>
                    <br/>
                    <h1>Unsupported browser</h1>
                </Header>
                <Modal.Content>
                    <h2 style={{"text-align":"center"}}>
                        Either the device or browser you are using to access this application is not supported.
                    </h2>
                    <h2 style={{"text-align":"center"}}>
                        We're sorry for your inconvenience, it's being actively worked on.
                    </h2>
                </Modal.Content>
                </Modal>
              </div>
            );
        }
        else{
            return(
                <div>
                    <h1 style={{color:"white",transform:"translateY(200%)"}}>Create some Voice notes !</h1>
                    <div className="createNewButtonContainer">
                        <Button as="button" className="createNewButton" onClick={this.props.setContextNew} key="03" size="huge" color="green">
                            New &nbsp;
                            <FontAwesomeIcon icon={faPlus}/>
                        </Button>
                    </div>
                    <Modal
                    basic
                    onClose={() => this.setState({openUnsupported:false})}
                    onOpen={() => this.setState({openUnsupported:true})}
                    open={this.state.openUnsupported}
                    size='small'
                    dimmer="blurring"
                    // trigger={<Button>Basic Modal</Button>}
                    >
                    <Header icon>
                        <FontAwesomeIcon icon={faTools} size="4x"/>
                        <br/>
                        <h1>Unsupported browser</h1>
                    </Header>
                    <Modal.Content>
                        <h2 style={{textAlign:"center"}}>
                            Either the device or browser you are using to access this application is not supported.
                        </h2>
                        <h2 style={{textAlign:"center"}}>
                            We're sorry for your inconvenience, it's being actively worked on.
                        </h2>
                    </Modal.Content>
                    </Modal>
                </div>
            );
        }
    }
}

export default Home;