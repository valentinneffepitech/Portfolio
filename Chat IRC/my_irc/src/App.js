import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3001")

function App() {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [newname, setNewName] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [message, setMessage] = useState('');
  const [idRoom, setIdRoom] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [listRooms, setListRooms] = useState([]);
  const [channelUsers, setChannelUsers] = useState([]);
  const [listMessages, setListMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isConnected) {
      socket.on('new user', (data) => {
        setListUser(data[0]);
        setListRooms(data[1]);
        showNotif(data[0][(data[0].length) - 1].username, 'user', 'joined')
      })
      socket.on('new room', data => {
        setListRooms(data);
        showNotif(data[(data.length) - 1].room, 'server', 'created')
      })
      socket.on('getMSG', data => {
        setListMessages(list => [...list, data]);
        let chat = document.querySelector('#chat_body')
        chat.scrollTop = chat.scrollHeight;
      })
      socket.on('userjoin', data => {
        setListMessages(list => [...list, data]);
      })
      socket.on('userleft', data => {
        setListMessages(list => [...list, data]);
      })
      socket.on('disco', data => {
        setListUser(data[0]);
        if (data[1]) {
          let notif = document.querySelector('#notif');
          let aside = document.createElement('aside');
          aside.classList.add('alert-danger')
          aside.classList.add('popup')
          aside.textContent = `${data[1].username} has disconnected !`;
          notif.appendChild(aside);
          notif.scrollTop = notif.scrollHeight
          setTimeout(() => {
            aside.remove();
          }, 5000)
        }
      })
      socket.on('updateUser', data => {
        setListUser(data[1])
        let notif = document.querySelector('#notif');
        let aside = document.createElement('aside');
        aside.classList.add('alert-primary');
        aside.classList.add('popup');
        aside.textContent = `${data[0].oldname} has become ${data[0].username}`;
        notif.appendChild(aside);
        notif.scrollTop = notif.scrollHeight;
        setTimeout(() => {
          aside.remove();
        }, 5000)
      })
      socket.on('users_channel', data => {
        setChannelUsers(data)
      })
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected) {
      socket.on('channel_deleted', data => {
        listMessages.forEach((msg) => {
          if (msg.room === data.room) {
            let index = listMessages.indexOf(msg);
            listMessages.splice(index, 1);
          }
        })
        setListRooms(data.channels)
        let notif = document.querySelector('#notif');
        let aside = document.createElement('aside');
        aside.classList.add('alert-danger')
        aside.classList.add('popup')
        aside.textContent = `${data.room} has been closed`;
        notif.appendChild(aside);
        notif.scrollTop = notif.scrollHeight
        setTimeout(() => {
          aside.remove();
        }, 5000)
        if (room === data) {
          setRoom('');
        }
      })
    }
  }, [isConnected])

  const showNotif = (fullname, type, status) => {
    if (!isConnected) {
      return;
    }
    let notif = document.querySelector('#notif');
    let aside = document.createElement('aside');
    if (type === "server") {
      if (status === 'created') {
        aside.classList.add('alert-success')
        aside.classList.add('popup')
        aside.textContent = `ChatRoom ${fullname} has been created !`;
      } else if (status === 'deleted') {
        aside.classList.add('alert-warning')
        aside.classList.add('popup')
        aside.textContent = `ChatRoom ${fullname} has been deleted !`;
      }
    } else if (type === "user") {
      if (status === 'joined') {
        aside.textContent = `${fullname} has connected !`;
        aside.classList.add('alert-success')
        aside.classList.add('popup')
      } else if (status === 'left') {
        aside.innerHTML = `${fullname} has disconnected !`;
        aside.classList.add('alert-success')
        aside.classList.add('popup')
      }
    } else {
      return;
    }
    notif.appendChild(aside);
    notif.scrollTop = notif.scrollHeight;
    setTimeout(() => {
      aside.remove();
    }, 5000)

  }

  const resumeChannelUsers = channelUsers.map((user) => {
    return (<li className="list-group-item" onClick={() => {
      document.querySelector('#message').value = '/msg ' + user.id + ' ';
      document.querySelector('#message').focus();
    }}>{user.username}</li>);
  })

  const resumeUser = listUser.map((user) => {
    if (user.id !== socket.id) {
      return (<li className="list-group-item" onClick={() => {
        document.querySelector('#message').value = '/msg ' + user.id + ' ';
        document.querySelector('#message').focus();
      }}>{user.username}</li>);
    } else {
      return (<div></div>);
    }
  })

  const resumeChannel = listRooms.map((room) => {
    return (<li className="list-group-item channels" onClick={() => {
      socket.emit('join_channel', room.room, name)
      setRoom(room.room)
    }}>{room.room}</li>)
  })

  const resumeMessage = listMessages.map((msg) => {
    if (msg.room === room) {
      if (msg.user_id !== socket.id) {
        if (msg.status !== 'public') {
          return (<div className={'message personnal_message rounded'}>
            <p><span className="sender" onClick={() => {
              document.querySelector('#message').value = '/msg ' + msg.user_id + ' ';
              document.querySelector('#message').focus();
            }}>{msg.author}</span> : {msg.content}</p>
          </div>)
        } else {
          return (<div className={'status'}>
            <p>{msg.content}</p>
          </div>)
        }

      } else {
        if (msg.status !== 'public') {
          return (<div className={'message personnal_message rounded you'}>
            <p>You sent : {msg.content}</p>
          </div>)
        } else {
          return (<div className={'status'}>
            <p>{msg.content}</p>
          </div>)
        }
      }
    } else if (msg.room === socket.id) {
      return (<div className={'message personnal_message rounded private_message'}>
        <p><span className="sender" onClick={() => {
          document.querySelector('#message').value = '/msg ' + msg.user_id + ' ';
          document.querySelector('#message').focus();
        }}>{msg.author}</span> : {msg.content}</p>
      </div>)
    } else {
      return (<div></div>)
    }
  })

  useEffect(() => {
    listRooms.forEach(salle => {
      if (salle.room === room && salle.id_user === socket.id) {
        setIdRoom(true)
        return;
      } else {
        setIdRoom(false)
      }
    })
  }, [room, listRooms])

  useEffect(() => {
    console.log(channelUsers)
  }, [channelUsers])

  const joinChat = () => {
    if (name !== "") {
      let newname = name.split(' ').join('');
      setIsConnected(true);
      setName(newname);
      socket.emit('userlog', name);
    }
  }

  const leaveRoom = () => {
    setRoom('');
    socket.emit("leaveroom", room, name);
  }

  const sendMessage = () => {
    if (message !== '') {
      let utility = message.split(' ');
      let fonction = utility[0];
      let reste;
      switch (fonction) {
        case '/nick': {
          utility.shift();
          reste = utility.join(' ');
          socket.emit('changeNick', {
            oldname: name,
            username: reste
          });
          setName(reste)
          break;
        }
        case '/list': {
          utility.shift();
          reste = utility.join(' ');
          if (reste !== "") {
            socket.emit('liste_channel', reste);
          } else {
            socket.emit('liste_all_channels', null);
          }
          break;
        }
        case '/create': {
          utility.shift();
          reste = utility.join(' ');
          if (reste !== "") {
            socket.emit('create_channel', reste);
          }
          setRoom(reste);
          break;
        }
        case '/join': {
          utility.shift();
          reste = utility.join(' ');
          if (reste !== "") {
            socket.emit('join_channel', reste, name);
          }
          setRoom(reste);
          break;
        }
        case '/delete': {
          utility.shift();
          reste = utility.join(' ');
          if (reste !== "") {
            socket.emit('supprimer_channel', reste);
          }
          setRoom('');
          break;
        }
        case '/leave': {
          utility.shift();
          reste = utility.join(' ');
          if (reste !== "") {
            socket.emit('leaveroom', reste, name);
          }
          setRoom('')
          break;
        }
        case '/users': {
          socket.emit('list_users', room);
          break;
        }
        case '/msg': {
          utility.shift();
          let destinataire = utility.shift();
          reste = utility.join(' ');
          if (destinataire && reste !== "") {
            socket.emit('envoyer_message', {
              room: destinataire,
              content: reste,
              author: name,
              user_id: socket.id,
              status: 'private'
            });
            let message = {
              room: socket.id,
              content: reste,
              author: 'you',
              user_id: socket.id,
              status: 'private'
            }
            setListMessages(list => [...list, message])
          }
          break;
        }
        default: {
          if (room !== '') {
            socket.emit('envoyer_message', {
              content: message,
              author: name,
              room: room,
              user_id: socket.id,
              status: 'private'
            })
          }
        }
      }
    }
    document.querySelector('#message').value = '';
  }

  return (
    <div className="App">
      <div id="logo">
        <img src="reality-chat.png" alt="reality-chat" />
      </div>
      {(!isConnected) ?
        <div className="container d-flex flex-column align-items-center justify-content-center" id="disco">
          <h1 id="title">My IRC</h1>
          <input type="text" id="connect_input" className="form-control" placeholder="Renseignez votre pseudo..." onChange={(e) => {
            setName(e.target.value)
          }} onKeyDown={(e) => {
            e.key === 'Enter' && joinChat()
          }} />
          <button className="btn mt-4" onClick={() => joinChat()}>Rejoindre le Chat</button>
        </div> :
        <div className="container">
          <div id="modifier">
            <div id="modify_name" className='d-flex justify-content-around mt-3'>
              <div className='d-flex'>
                <input type="text" id="change_name" className='form-control' placeholder='Changer de nom' onChange={(e) => {
                  setNewName(e.target.value)
                }} />
                <button className='btn btn-secondary' onClick={(e) => {
                  if (newname !== '') {
                    socket.emit('changeNick', {
                      oldname: name,
                      username: newname,
                      room: room
                    });
                    setName(newname)
                    document.querySelector('#change_name').value = ""
                  }
                }}>Modifier</button>
              </div>
            </div>
            <div id="creating_room" className='mt-3'>
              <div className='d-flex'>
                <input type="text" id="create_room" className='form-control' placeholder='Créer un salon' onChange={(e) => {
                  setNewRoom(e.target.value)
                }} />
                <button className='btn btn-secondary' onClick={(e) => {
                  if (newRoom !== '') {
                    socket.emit('create_channel', newRoom);
                    setRoom(newRoom);
                    document.querySelector('#create_room').value = ""
                  }
                }}>Créer</button>
              </div>
            </div>
          </div>
          <div id="liste">
            <ul className="list-group"><span id="liste_header">Utilisateurs connectés :</span>
              {resumeUser}
            </ul>
            <ul className="list-group"><span id="liste_header">Channels Actifs :</span>
              {resumeChannel}
            </ul>
          </div>
          {(idRoom) ?
            <div>
              <button id="del_button" className='btn btn-danger' onClick={() => {
                socket.emit('supprimer_channel', {
                  room: room
                })
                console.log(room)
              }
              }>Delete this channel</button>
            </div> :
            <div>
            </div>}
          {(room !== "") ?
            <div id="channel_users">
              <ul className="list-group"><span id="liste_header">Utilisateurs connectés à ce salon:</span>
                {resumeChannelUsers}
              </ul>
            </div> :
            <div></div>
          }
          <div id="chat">
            {(room !== '') ?
              <div className="rounded d-flex align-items-center justify-content-between" id="chat_head">
                <h3>Serveur {room}</h3><button className='btn btn-warning' onClick={() => {
                  leaveRoom();
                }}>Leave Room</button>
              </div>
              :
              <div className="rounded d-flex align-items-center" id="chat_head">
                <h3>Vous n'êtes dans aucun salon</h3>
              </div>
            }
            <div className="rounded" id="chat_body">
              {resumeMessage}
            </div>
            <div className="rounded d-flex align-items-center" id="chat_footer">
              <input type="text" className="form-control" id="message" placeholder="Votre Message Ici" onChange={(e) => {
                setMessage(e.target.value)
              }}
                onKeyDown={(e) => {
                  e.key === 'Enter' && sendMessage()
                }} />
            </div>
          </div>
          <div id="notif" className="alert"></div>
        </div>
      }
    </div >
  );
}

export default App;
