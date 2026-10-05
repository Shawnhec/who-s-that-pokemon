const Timer = ({ timeLeft, timeTotal }) => {
  const timeLeftPercent = timeLeft / timeTotal;
  const timeStatus = timeLeftPercent <= 0.2 ? "danger" : timeLeftPercent <= 0.5 ? "warning" : "safe";

  return (
    <div className="timer">
      <p className="stat timer-text">Time: {timeLeft}s</p>
      <div className="timer-bar">
        <div
          className={`timer-fill ${timeStatus}`}
          style={{ width: `${(timeLeft / timeTotal) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
