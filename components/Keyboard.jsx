import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalPerfect, faWifi3, faBattery, faPhone } from '@fortawesome/free-solid-svg-icons';

const TimeDisplay = ({ currentTime }) => <div className="text-sm ms-1 mt-1 font-medium">{currentTime}</div>;

const SignalBatteryIndicators = () => (
  <div className="flex items-center space-x-2 me-1">
    <FontAwesomeIcon icon={faSignalPerfect} width={14} height={14} />
    <FontAwesomeIcon icon={faWifi3} width={14} height={14} />
    <FontAwesomeIcon icon={faBattery} width={14} height={14} />
  </div>
);

const NumericKeyboard = ({ handleButtonClick }) => (
  <div className="grid grid-cols-3 gap-4 w-44 mt-auto mx-auto mb-5">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((button) => (
      <button
        key={button}
        className="rounded-full bg-neutral-200 p-3 text-center"
        onClick={() => handleButtonClick(button)}
      >
        {button}
      </button>
    ))}
  </div>
);

const CallButton = ({ handleButtonClick }) => (
  <div className="flex justify-center mb-10">
    <button className="rounded-full bg-green-500 text-white p-3" onClick={() => handleButtonClick('Call')}>
      <FontAwesomeIcon width={18} height={18} icon={faPhone} />
    </button>
  </div>
);

const Keyboard = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const getCurrentISTTime = () => {
      const options = { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric' };
      const istTime = new Date().toLocaleTimeString('en-US', options);
      setCurrentTime(istTime);
    };

    const intervalId = setInterval(getCurrentISTTime, 1000);

    getCurrentISTTime();

    return () => clearInterval(intervalId);
  }, []);

  const handleButtonClick = (button) => {
    console.log(`Button clicked: ${button}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="iphone-frame border-8 border-black w-64 overflow-hidden h-[500px] bg-white relative flex flex-col">
        <div className="flex justify-between items-center px-2">
          <TimeDisplay currentTime={currentTime} />
          <SignalBatteryIndicators />
        </div>
        <div className="norch absolute top-0 z-50 left-1/2 transform -translate-x-1/2 h-6 w-24 bg-black rounded-b-lg"></div>
        <div className="absolute bottom-2 h-1 rounded-full w-24 left-1/2 z-10 bg-zinc-950 transform -translate-x-1/2"></div>
        <NumericKeyboard handleButtonClick={handleButtonClick} />
        <CallButton handleButtonClick={handleButtonClick} />
      </div>
    </div>
  );
};

export default Keyboard;
