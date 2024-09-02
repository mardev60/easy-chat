import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface ChatMessage {
  username: string;
  message: string;
}

const socket: Socket = io('http://localhost:3000');

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    socket.on('message', (payload: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, payload]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const connectToChat = () => {
    if (username) {
      setConnected(true);
    }
  };

  const sendMessage = () => {
    if (message) {
      socket.emit('message', { username, message });
      setMessage('');
    }
  };

  return (
    <div className="App">
      {!connected ? (
        <div className="username-container">
          <h2>Entrez votre nom d'utilisateur</h2>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={connectToChat}>Rejoindre le Chat</button>
        </div>
      ) : (
        <>
          <h2>Bienvenue, {username}!</h2>
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.username === username ? 'user' : 'other'}`}
              >
                <strong>{msg.username}</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="footer">
            <div className="input-container">
              <input
                type="text"
                placeholder="Tapez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Envoyer</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;