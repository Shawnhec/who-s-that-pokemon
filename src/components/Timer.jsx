const Timer = ({ timeLeft, total }) => {
  const status = timeLeft <= 5 ? "danger" : timeLeft <= 10 ? "warning" : "safe";

  return (
    <div className="timer">
      <p className="stat timer-text">Time: {timeLeft}s</p>
      <div className="timer-bar">
        <div
          className={`timer-fill ${status}`}
          style={{ width: `${(timeLeft / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
