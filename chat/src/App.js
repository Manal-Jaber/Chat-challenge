import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css'
class App extends Component {

  state = {
    isConnected:false,
    id:null,
    peeps : [],
    // answer: '',
    message: '',
    username:'',
    name: 'Manal',
    oldMessages: [],
    newMessage: null
  }
  socket = null

  componentWillMount(){

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })
    // this.socket.on('pong!',(additionalStuff)=>{
    //   console.log('the server answered!',additionalStuff)
    // })
    this.socket.on('youare',(answer)=>{
      this.setState({id:answer.id})
    })
    this.socket.on('peeps', (clients) => {
      this.setState({peeps: clients})
    })
    this.socket.on('new connection', (con) => {
      this.setState(prevState => ({
        peeps: [...prevState.peeps, con]
      }))
    })
    this.socket.on('new disconnection', (con) => {
      let newPeeps = this.state.peeps.filter((peep) => peep !== con);
      this.setState({peeps: newPeeps})
    })
    // this.socket.on('next',(message_from_server)=>{
    //   console.log(message_from_server)
    // })
    // this.socket.on('addition',(message_from_server)=>{
    //   console.log(message_from_server)
    // })
    /** this will be useful way, way later **/
    this.socket.on('room', old_messages => {
      this.setState({oldMessages:old_messages})
      console.log(old_messages)
    })
    this.socket.on('room_message',(room_message)=>{
      this.setState({newMessage:room_message})
      console.log(room_message)
    })
    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })

  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  render() {
    return (<div className="App">
      <div className={'side-panel'}>
        <div className={'status'}>{this.state.isConnected ? 'connected' : 'disconnected'} <button onClick={()=>this.socket.emit('whoami')}>with id:</button><br/>{this.state.id}</div>
        <div className={'username-section'}>
          <p className={'username'}>{this.state.name}</p>
          <input type={Text} value={this.state.username} onChange={(e)=>{this.setState({username: e.target.value})}}></input>
          <button onClick={()=>this.setState({name: this.state.username, username: ''})}>Change Username</button>
          <h1>Online People</h1>
          <div className={'online'}>
            {this.state.peeps.length}
            <ul>
            {this.state.peeps.map((peep,index)=>{
              return(
                <li key={index}>{peep}</li>
              )
            })}
            </ul>
          </div>
        </div>
      </div>
      {/* <button onClick={()=>this.socket.emit('ping!')}>ping</button> */}
      {/* and also add: */}
      
      {/* <button onClick={()=>this.socket.emit('give me next')}>Next</button> */}
      {/* <button onClick={()=>this.socket.emit('addition')}>Addition</button> */}
      {/* <input type={String}  onChange={(e)=>{this.setState({answer: e.target.value})}}></input>
      <button onClick={()=>this.socket.emit('answer', this.state.answer)}>Answer</button>  */}
      <div className={'messages'}>
        <input type={String} value={this.state.message} onChange={(e)=>{this.setState({message: e.target.value})}}></input>
        <button className={'send'} onClick={()=>{
          this.socket.emit('message', {
            text: this.state.message,
            id: this.state.id,
            name: this.state.name
          })
          this.setState({message:''})
        }}>Send</button>
        <div>
          {this.state.oldMessages.map((msg,index)=>{
            return(
              <div key={index}>
                <h1>{msg.name}</h1>
                <p>{msg.text}</p>
              </div>
            )
          })}
          {/* <div>
                <h1>{this.state.newMessage.name}</h1>
                <p>{this.state.newMessage.text}</p>
          </div> */}
        </div>
      </div>
    </div>);
  }
}

export default App;