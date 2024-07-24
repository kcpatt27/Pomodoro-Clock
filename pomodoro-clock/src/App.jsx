import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setTimeLeft(isSession ? sessionTime * 60 : breakTime * 60);
  }, [sessionTime, breakTime, isSession]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      timeoutRef.current = setTimeout(() => {
        playBeep();
        timeoutRef.current = setTimeout(() => {
          stopBeep();
          timeoutRef.current = setTimeout(() => {
            if (isSession) {
              setIsSession(false);
              setTimeLeft(breakTime * 60);
            } else {
              setIsSession(true);
              setTimeLeft(sessionTime * 60);
            }
          }, 1000);
        }, 1000);
      }, 0);
    }
  
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeLeft, isSession, breakTime, sessionTime]);

  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    }
  };
  const stopBeep = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTimeLeft = prev - 1;
          return newTimeLeft >= 0 ? newTimeLeft : 0;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);

    stopBeep();

    setIsRunning(false);
    setIsSession(true);
    setBreakTime(5);
    setSessionTime(25);

    setTimeLeft(25 * 60); // Reset to default values

    clearTimeout();
  };

  const handleSessionIncrement = () => {
    if (sessionTime < 60) {
      setSessionTime(sessionTime + 1);
    }
  };
  const handleSessionDecrement = () => {
    if (sessionTime > 1) {
      setSessionTime(sessionTime - 1);
    }
  };
  const handleSessionChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1 && value <= 60) {
      setSessionTime(value);
    }
  };

  const handleBreakIncrement = () => {
    if (breakTime < 60) {
      setBreakTime(breakTime + 1);
    }
  };
  const handleBreakDecrement = () => {
    if (breakTime > 1) {
      setBreakTime(breakTime - 1);
    }
  };
  const handleBreakChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1 && value <= 60) {
      setBreakTime(value);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <>
      <div id='clock'>

        <div id='session-container'>
          <div id='session-label'>Session Length</div>
          <button id='session-decrement' className='update' onClick={handleSessionDecrement}>-1</button>
          <input
            id='session-length'
            type='number'
            min={1}
            max={60}
            value={sessionTime}
            onChange={handleSessionChange}
          />
          <button id='session-increment' className='update' onClick={handleSessionIncrement}>+1</button>
        </div>

        <div id='break-container'>
          <div id='break-label'>Break Length</div>
          <button id='break-decrement' className='update' onClick={handleBreakDecrement}>-1</button>
          <input
            id='break-length'
            type='number'
            min={1}
            max={60}
            value={breakTime}
            onChange={handleBreakChange}
          />
          <button id='break-increment' className='update' onClick={handleBreakIncrement}>+1</button>
        </div>

        <div id='timer-label'>
          {isSession ? 'Session' : 'Break'}
        </div>

        <div id='time-left'>
          {formatTime(timeLeft)}
        </div>

        <button id='start_stop' onClick={handleStartStop}>Start / Stop</button>
        <button id='reset' onClick={handleReset}>Reset</button>
        
      </div>
      <audio 
      id="beep" 
      preload="auto" 
      ref={audioRef} 
      src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </>
  );
}

export default App;
