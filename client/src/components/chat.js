import React from "react";
import io from "socket.io-client";
import API from "../utils/API";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: {},
            userAvatar: {},
            message: '',
            privateMessage: '',
            messages: [],
            users: []
        };

        this.socket = io('https://ichatmyselfproject.herokuapp.com');

        this.socket.on('RECEIVE_MESSAGE', data => {
            addMessage(data);
        });

        this.socket.on('connection', socket => {
            let id = this.socket.io.engine.id;
            console.log(socket);
        });

        this.socket.on('disconnect', socket => {
            this.logOut();
            let id = this.socket.io.engine.id;
            console.log(id);
        });

        const addMessage = data => {
            console.log(data);
            this.setState({ messages: [...this.state.messages, data] });
            console.log(this.state.messages);
        };

        this.idleTimer = () => {
            window.onmousemove = clearTimeout(this.logOut); // catches mouse movements
            window.onmousedown = clearTimeout(this.logOut); // catches mouse movements
            window.onclick = clearTimeout(this.logOut);     // catches mouse clicks
            window.onscroll = clearTimeout(this.logOut);    // catches scrolling
            window.onkeypress = clearTimeout(this.logOut);  //catches keyboard actions
        };

        this.sendMessage = ev => {
            ev.preventDefault();
            if (this.state.message) {
                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    userAvatar: this.state.userAvatar,
                    message: this.state.message
                })
            }

            this.setState({ message: '' });
        }

        this.logOut = ev => {
            ev.preventDefault();
            API.logOut({
            })
                .then(res => window.location = "/login")
        }
    }


    loadUsers = () => {
        API.getUsers()
            .then(res =>
                this.setState({ users: res.data })
            )
    }

    loadUser = () => {
        API.getUser()
            .then(res =>
                this.setState({ username: res.data.username, userAvatar: res.data.avatarURL })
            )
    }
    
    componentDidMount() {
        this.loadUser();
        setInterval(this.loadUsers, 3000);
        setTimeout(this.logOut, 180000);
        this.idleTimer();
    }

    componentWillUnmount() {
        clearInterval(this.loadUsers);
        clearTimeout(this.logOut);
        this.logOut();
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-4 sm-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title"><h4> {this.state.users.length} <i className="fas fa-users"></i> Online Now </h4></div>
                                <hr />
                                {this.state.users.length ? (
                                    <div className="users flex-fill text-justify-center">
                                        {this.state.users.map(user => (
                                            <div key={user._id}>
                                                <strong>
                                                    <img className="img-fluid" alt="" src={user.avatarURL}></img>&nbsp;{user.username}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                        <h4><i className="fab fa-react fa-spin"></i> Loading Users <i className="fab fa-react fa-spin"></i></h4>
                                    )}
                                <hr />
                                <h4> <i className="far fa-comment-alt"></i> Messages </h4>
                                <hr />
                                <div className="messages">
                                    {this.state.messages.slice(0).reverse().map(message => {
                                        return (
                                            <div><strong><img className="img-fluid" alt="" src={message.userAvatar}></img>&nbsp;{message.author}</strong>: {message.message}</div>
                                        )
                                    })}
                                </div>

                            </div>
                            <div className="card-footer">
                                <input type="text" placeholder="📝 Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} autoFocus />
                                <br />
                                <button onClick={this.sendMessage} className="btn btn-primary form-control"> <i className="far fa-paper-plane"></i> Send </button>
                                <br />
                                <button onClick={this.logOut} className="btn btn-danger form-control"> <i className="fas fa-user-slash"></i> Logout </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
