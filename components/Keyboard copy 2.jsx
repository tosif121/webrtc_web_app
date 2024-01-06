import React, { useState } from 'react';
import JsSIP from 'jssip';

const SipComponent = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dialNumber, setDialNumber] = useState('');
  const [ua, setUa] = useState(null);
  const [options, setOptions] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const startPhone = async () => {
    const socket = new JsSIP.WebSocketInterface('wss://webrtc.iotcom.io:8089/ws');
    const configuration = {
      sockets: [socket],
      uri: `sip:${username}@webrtc.iotcom.io`,
      authorization_user: username,
      password: password,
      display_name: username,
    };

    const uaInstance = new JsSIP.UA(configuration);

    uaInstance.start();

    uaInstance.on('registered', (data) => {
      setIsRegistered(true);
      console.log(data.response.data);
    });

    uaInstance.on('registrationFailed', (data) => {
      setIsRegistered(false);
      console.log(data.response.data);
    });

    uaInstance.on('newRTCSession', (data) => {
      const session = data.session;
      console.log('Call Direction is ' + session.direction);

      if (session.direction === 'incoming') {
        session.answer({
          mediaConstraints: { audio: true, video: true },
          pcConfig: { iceServers: [] }, // Add your ICE servers here if needed
        });

        session.connection.addEventListener('addstream', (e) => {
          setRemoteStream(e.stream);
        });
      } else if (session.direction === 'outgoing') {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            setLocalStream(stream);
            session.connection.addStream(stream);
            session.connection.addEventListener('addstream', (e) => {
              setRemoteStream(e.stream);
            });
            session.connect();
          })
          .catch((error) => {
            console.error('Error accessing media devices:', error);
          });
      }
    });

    const eventHandlers = {
      progress: function (e) {
        console.log('Call is in progress');
      },
      failed: function (e) {
        console.log('Call failed with cause: ' + e.data.cause);
      },
      ended: function (e) {
        console.log('Call ended with cause: ' + e.cause);
        console.log(e);
      },
      confirmed: function (e) {
        console.log('Call confirmed');
      },
      addstream: function (e) {
        console.log('Remote stream added');
        setRemoteStream(e.stream);
      },
    };

    const callOptions = {
      eventHandlers: eventHandlers,
      mediaConstraints: { audio: true, video: true },
    };

    setUa(uaInstance);
    setOptions(callOptions);
  };

  const dialFunc = () => {
    if (ua && options) {
      const session = ua.call(`sip:${dialNumber}@webrtc.iotcom.io`, options);
    }
  };

  const retryRegistration = () => {
    console.log('Retry clicked');
    setIsRegistered(false);
  };

  return (
    <div>
      {!isRegistered && (
        <div>
          <h1>My Phone !!</h1>
          <div className="container" id="creds">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={startPhone} className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      )}

      {isRegistered && (
        <div>
          <div className="container" id="status">
            <div className="mb-3">
              <input
                type="text"
                id="dialnumber"
                placeholder="Enter number"
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
              />
              <button onClick={dialFunc} className="btn btn-primary">
                Dial
              </button>
            </div>
          </div>
        </div>
      )}

      {!isRegistered && (
        <div className="container" id="statusfailed">
          <div className="mb-3">
            <button onClick={retryRegistration} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      )}

      {localStream && (
        <div className="container">
          <h3>Local Video</h3>
          <video id="localvideo" autoPlay playsInline ref={(video) => (video.srcObject = localStream)}></video>
        </div>
      )}

      {remoteStream && (
        <div className="container">
          <h3>Remote Video</h3>
          <video id="remotevideo" autoPlay playsInline ref={(video) => (video.srcObject = remoteStream)}></video>
        </div>
      )}
    </div>
  );
};

export default SipComponent;
