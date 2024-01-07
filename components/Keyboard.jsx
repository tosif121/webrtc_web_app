import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalPerfect, faWifi3, faBattery, faPhone, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import JsSIP from 'jssip';

const TimeDisplay = ({ currentTime }) => <div className="text-sm ms-1 mt-1 font-medium">{currentTime}</div>;

const SignalBatteryIndicators = () => (
  <div className="flex items-center space-x-2 me-1">
    <FontAwesomeIcon icon={faSignalPerfect} width={14} height={14} />
    <FontAwesomeIcon icon={faWifi3} width={14} height={14} />
    <FontAwesomeIcon icon={faBattery} width={14} height={14} />
  </div>
);

const NumericKeyboard = ({ handleButtonClick, handleCallClick, handleRemoveClick }) => (
  <>
    <div className="grid grid-cols-3 gap-4 w-44 mx-auto my-5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((button) => (
        <button
          key={button}
          className="rounded-full bg-neutral-200 p-3 text-center rounded-full-touch"
          onClick={() => handleButtonClick(button)}
        >
          {button}
        </button>
      ))}
      <div className=""></div>
      <div className="">
        <button className="rounded-full bg-green-500 text-white p-3 call-touch" onClick={handleCallClick}>
          <FontAwesomeIcon width={18} height={18} icon={faPhone} />
        </button>
      </div>
      <div className="">
        <button className="rounded-full bg-gray-500 text-white p-3 rounded-full-touch" onClick={handleRemoveClick}>
          <FontAwesomeIcon width={18} hanging={18} icon={faRectangleXmark} />
        </button>
      </div>
    </div>

    <div className="flex justify-center mb-10"></div>
  </>
);

const Keyboard = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [clickedNumbers, setClickedNumbers] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const getCurrentISTTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
      };
      const istTime = new Date().toLocaleTimeString('en-US', options);
      setCurrentTime(istTime);
    };

    const intervalId = setInterval(getCurrentISTTime, 1000);

    getCurrentISTTime();

    return () => clearInterval(intervalId);
  }, []);

  const startPhone = async () => {
    try {
      await userAgent.start();
      console.log('Phone started successfully');
    } catch (error) {
      console.error('Error starting the phone:', error);
    }
  };

  const dialFunc = () => {
    const target = `sip:${clickedNumbers}@webrtc.iotcom.io`;
    const options = { mediaConstraints: { audio: true, video: true } };
    const session = userAgent.call(target, options);
    setShowVideo(true);
    // Setup local video stream
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    // Handle session events, if needed
    session.connection.addEventListener('track', (event) => {
      if (event.track.kind === 'video') {
        remoteVideoRef.current.srcObject = new MediaStream([event.track]);
      }
    });
  };

  const retryRegistration = () => {
    userAgent.register();
  };

  const handleButtonClick = (button) => {
    setClickedNumbers((prevNumbers) => prevNumbers + button);
  };

  const handleRemoveClick = () => {
    setClickedNumbers((prevNumbers) => prevNumbers.slice(0, -1));
  };

  const configuration = {
    sockets: [new JsSIP.WebSocketInterface('wss://webrtc.iotcom.io:8089/ws')],
    uri: 'sip:webrtc_client@webrtc.iotcom.io',
    authorization_user: 'webrtc_client',
    password: 'password',
  };

  const userAgent = new JsSIP.UA(configuration);

  useEffect(() => {
    startPhone();

    // Handle registration events
    userAgent.on('registered', () => {
      console.log('Registered successfully');
    });

    userAgent.on('registrationFailed', (event) => {
      console.error('Registration failed:', event.cause);
      // Retry registration
      retryRegistration();
    });

    return () => {
      userAgent.stop();
    };
  }, [startPhone, retryRegistration, userAgent]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 flex-col md:flex-row">
      {(showVideo && (
        <div className="flex flex-col gap-2 m-2">
          <video ref={localVideoRef} className="w-[400px] h-[100%]" controls autoPlay playsInline />
          <video ref={remoteVideoRef} className="w-[400px] h-[100%]" controls autoPlay playsInline />
        </div>
      )) || (
        <div className="iphone-frame border-8 border-black w-64 overflow-hidden h-[500px] bg-white relative flex flex-col">
          <div className="flex justify-between items-center px-2">
            <TimeDisplay currentTime={currentTime} />
            <SignalBatteryIndicators />
          </div>
          <div className="norch absolute top-0 z-50 left-1/2 transform -translate-x-1/2 h-6 w-24 bg-black rounded-b-lg"></div>
          <div className="absolute bottom-2 h-1 rounded-full w-24 left-1/2 z-10 bg-zinc-950 transform -translate-x-1/2"></div>
          <input type="text" className="text-center mx-auto mt-auto text-xl" value={clickedNumbers} readOnly />
          <NumericKeyboard
            handleButtonClick={handleButtonClick}
            handleCallClick={dialFunc}
            handleRemoveClick={handleRemoveClick}
          />
        </div>
      )}
    </div>
  );
};

export default Keyboard;
