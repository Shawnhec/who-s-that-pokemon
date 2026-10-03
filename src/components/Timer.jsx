import React from 'react'

const Timer = ({timeLeft}) => {
    const status = timeLeft <= 5 ? "danger" : timeLefet <= 10 ? "warning" : "safe";

  return (
    <div className='"timer'>
        <p className="stat">Time: {timeLeft}s</p>
        <div className="time-bar">
            <div className={`time-fill ${status}`}
                 style={{width: `${(timeLeft / total) * 100} %`}}>
            </div>
        </div>
    </div>
    
  )
}

export default Timer