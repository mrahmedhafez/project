import React from 'react';
import { Row, Spinner } from 'reactstrap';
import { ContactHeader, Contacts, ChatHeader, Messages, MessageForm, UserProfile, EditProfile } from 'components';
import socketIO from 'socket.io-client';
import Auth from 'Auth';

class Chat extends React.Component {
  state = { 
    contacts: [],
    contact: {},
    messages:[],
    userProfile: false,
    profile: false,
  };

  componentDidMount(){
    this.initSocketConnection();
  }

  initSocketConnection = () => {
    let socket = socketIO(process.env.REACT_APP_SOCKET, {
      query: 'token='+ Auth.getToken()
    });
    socket.on('connect', () => this.setState({connected: true}));
    socket.on('disconnect', () => this.setState({connected: false}));
    socket.on('data', (user, contacts, messages, users) => {
      let contact = contacts[0] || {};
      this.setState({messages, contacts, user, contact}, () =>{
        this.updateUsersState(users);
      });
    });
    socket.on('error', err => {
      if (err === 'auth_error') {
        Auth.logout();
        this.props.history.push('/login');
      }
    });
    // socket.on('data', this.onData);
    socket.on('new_user', this.onNewUser);
    socket.on('update_user', this.onUpdateUser);
    socket.on('message', this.onNewMessage);
    socket.on('user_status', this.updateUsersState);
    socket.on('typing', this.onTypingMessage);
    // socket.on('error', this.onSocketError);
    this.setState({socket});
  };

  onNewUser = user => {
    let contacts = this.state.contacts.concat(user);
    this.setState({contacts});
  };

  logout = () => {
    this.state.socket.disconnect();
    Auth.logout();
    this.props.history.push('/');
  };

  onUpdateUser = user => {
    if (this.state.user.id === user.id) {
      this.setState({user});
      Auth.setUser(user);
      return;
    }
    let contacts = this.state.contacts;
    contacts.forEach((element, index) => {
      if(element.id === user.id) {
        contacts[index] = user;
        contacts[index].status = element.status;
      }
    });
    this.setState({contacts});
    if (this.state.contact.id === user.id) this.setState({contact: user});
  };

  onNewMessage = message => {
    if(message.sender === this.state.contact.id){
      this.setState({typing: false});
      this.state.socket.emit('seen', this.state.contact.id);
      message.seen = true;
    }
    let messages = this.state.messages.concat(message);
    this.setState({messages});
  };

  typingTimeout = () => this.setState({typing: false});

  sendMessage = message => {
    if(!this.state.contact.id) return;
    message.receiver = this.state.contact.id;
    let messages = this.state.messages.concat(message);
    this.setState({messages});
    this.state.socket.emit('message', message);
  };

  onTypingMessage = sender => {
    if(this.state.contact.id !== sender) return;
    this.setState({typing: sender});
    clearTimeout(this.state.timeout);
    const timeout = setTimeout(this.typingTimeout, 3000);
    this.setState({timeout});
  };

  sendType = () => this.state.socket.emit('typing', this.state.contact.id);

  updateUsersState = users => {
    let contacts = this.state.contacts;
    contacts.forEach((element, index) => {
      if(users[element.id]) contacts[index].status = users[element.id];
    });
    this.setState({contacts});
    let contact = this.state.contact;
    if(users[contact.id]) contact.status = users[contact.id];
    this.setState({contact});
  };

  onChatNavigate = contact => {
    this.setState({contact});
    this.state.socket.emit('seen', contact.id);
    let messages = this.state.messages;
    messages.forEach((element, index) => {
      if(element.sender === contact.id) messages[index].seen = true;
    });
    this.setState({messages});
  };

  userProfileToggle = () => this.setState({userProfile: !this.state.userProfile});

  profileToggle = () => this.setState({profile: !this.state.profile});

  render(){
    if(!this.state.connected || !this.state.contacts || !this.state.messages){
      return <Spinner id="loader" color="success" />
    }
    return(
      <Row className="h-100">
        <div id="contacts-section" className="col-6 col-md-4" >
        <ContactHeader user={this.state.user} toggle={this.profileToggle}/>
          <Contacts 
          contacts={this.state.contacts}
          messages={this.state.messages}
          onChatNavigate={this.onChatNavigate} />
          <UserProfile 
          contact={this.state.contact}
          toggle={this.userProfileToggle}
          open={this.state.userProfile} />
          <EditProfile 
          user={this.state.user}
          toggle={this.profileToggle}
          open={this.state.profile} />
        </div>
        <div id="messages-section" className="col-6 col-md-8">
        <ChatHeader 
          contact={this.state.contact}
          typing={this.state.typing}
          toggle={this.userProfileToggle}
          logout={this.logout} />
        {this.renderChat()}
        <MessageForm sender={this.sendMessage} sendType={this.sendType}/>
        </div>
      </Row>
    );
  }

  renderChat = () => {
    const { contact, user } = this.state;
    if(!contact) return;
    let messages = this.state.messages.filter(e => e.sender === contact.id || e.receiver === contact.id);
    return <Messages user={user} messages={messages} />
  };
}

export default Chat;