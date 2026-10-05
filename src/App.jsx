import { useState, useRef, useEffect } from "react";
import "./App.css";
import { pokemons } from "./data/pokemon";
import pokeBall from "./assets/pokeball.webp";
import greatBall from "./assets/greatball.webp";
import ultraBall from "./assets/ultraball.webp";
import masterBall from "./assets/masterball.webp";
import pokeballRed from "./assets/pokeball-red.png";
import pokeballBlue from "./assets/pokeball-blue.png";
import pokeballYellow from "./assets/pokeball-yellow.png";
import pokeballPurple from "./assets/pokeball-purple.png";
import wallpaper1 from "./assets/wallpaper1.png";
import wallpaper2 from "./assets/wallpaper2.svg";
import ModeButton from "./components/ModeButton";
import ArrowButton from "./components/ArrowButton";
import Timer from "./components/Timer";

const THEMES = [
  {
    name: "classic",
    wallpaper: wallpaper1,
    levels: {
      beginner: pokeBall,
      intermediate: greatBall,
      advanced: ultraBall,
      master: masterBall,
    },
  },
  {
    name: "modern",
    wallpaper: wallpaper2,
    levels: {
      beginner: pokeballRed,
      intermediate: pokeballBlue,
      advanced: pokeballYellow,
      master: pokeballPurple,
    },
  },
];

const TIME_LIMIT = 15;

// 開始畫面顯示的難度說明
const LEVEL_INFO = {
  beginner:
    "No score, no pressure. Use hints, shuffle the deck, and set aside the Pokémon you've mastered.",
  intermediate:
    "Your score counts now. Hints are on, but you must name each Pokémon or give up before moving on.",
  advanced:
    "No hints. You can't move on until you name the Pokémon or flip the card to give up.",
  master: `No hints, no skipping, and only ${TIME_LIMIT} seconds per card. When time runs out, the card flips and your streak resets.`,
};

const RESULT_ICON = { correct: "✓", skip: "✗", timeout: "⏱" };

function formatPokemon(p) {
  return {
    ...p,
    pokedexNumber: p.pokedexNumber.toString().padStart(3, "0"),
  };
}

// Fisher–Yates：回傳洗好的新陣列，不改到原本的陣列
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 除了 keepIdx 那張，其他卡片重新洗牌
function shuffleExcept(arr, keepIdx) {
  const others = shuffle(arr.filter((_, i) => i !== keepIdx));
  others.splice(keepIdx, 0, arr[keepIdx]);
  return others;
}

// 洗牌後取前 n 隻，同一隻不會出現兩次
function drawDeck(n) {
  return shuffle(pokemons).slice(0, n).map(formatPokemon);
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// 手指觸控的裝置（手機、平板）
function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

const App = () => {
  const [showHint, setShowHint] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [themeIdx, setThemeIdx] = useState(1);
  const [currIdx, setCurrIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sequence, setSequence] = useState([]);
  const [totalGuess, setTotalGuess] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [correctCnt, setCorrectCnt] = useState(0);
  const [revealedCnt, setRevealedCnt] = useState(0);
  const [mode, setMode] = useState("");
  const [level, setLevel] = useState("beginner");
  const [mastered, setMastered] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [showResult, setShowResult] = useState(false);

  const guessInputRef = useRef(null);
  const initInputRef = useRef(null);
  const scrollYRef = useRef(0); // 鍵盤出現前的捲動位置

  useEffect(() => {
    function handleKeyDown(e) {
      if (totalGuess === 0 || sequence.length === 0) return;
      const typing = e.target.tagName === "INPUT";
      if (
        typing &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        !flipped
      )
        return;


      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleManualReveal();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFlipped(false); // ↓ 翻回正面
      }
      if (e.key === "ArrowLeft") handlePreviousPokemon();
      if (e.key === "ArrowRight") handleNextPokemon();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const pokemon = sequence[currIdx];
  const isFirst = currIdx === 0;
  const isLast = currIdx === sequence.length - 1;
  const hintEnabled = mode === "beginner" || mode === "intermediate";
  const mustGuess =
    mode === "intermediate" || mode === "advanced" || mode === "master";
  const nextLocked = mustGuess && !pokemon?.revealed;
  const score = ((correctCnt / totalGuess) * 100).toFixed(2) + "%";
  const theme = THEMES[themeIdx];
  const timed = mode === "master";

  const timeLeftPercent = timeLeft / TIME_LIMIT;
  const timeStatus =
    timeLeftPercent <= 0.2
      ? "danger"
      : timeLeftPercent <= 0.5
        ? "warning"
        : "safe";
  // const revealedCnt = sequence.filter((p) => p.revealed).length; // 已揭曉的張數
  const isGameOver =
    (mode === "beginner" && sequence.length === 0) ||
    ((mode === "intermediate" || mode === "advanced" || mode === "master") &&
      revealedCnt === totalGuess);

  // Master：每張還沒揭曉的卡倒數 TIME_LIMIT 秒
  useEffect(() => {
    if (!timed || !pokemon || pokemon.revealed) return; // 不需要倒數

    const id = setTimeout(() => {
      if (timeLeft > 1) {
        setTimeLeft(timeLeft - 1);
        return;
      }
      // 時間到：當作放棄這張
      setSequence((s) =>
        s.map((p, i) =>
          i === currIdx ? { ...p, revealed: true, guessResult: "timeout" } : p,
        ),
      );
      setRevealedCnt((c) => c + 1);
      setStreak(0);
      setFlipped(true);
      setTimeLeft(TIME_LIMIT);
    }, 1000);

    return () => clearTimeout(id);
  }, [timed, pokemon, timeLeft, currIdx]);

  function handleInit(e) {
    e.preventDefault();

    const input = initInputRef.current.value;
    const value = input === "" ? 10 : Number(input); // 沒填就用 10 張
    if (!Number.isInteger(value) || value < 1 || value > pokemons.length)
      return;

    if (isTouchDevice()) {
      initInputRef.current.blur();
    }
    setMode(level);
    setSequence(drawDeck(value));
    setCurrIdx(0);
    setTotalGuess(value);
    setTimeLeft(TIME_LIMIT);
  }

  function handleManualReveal() {
    if (!pokemon.revealed) {
      markRevealed(currIdx, "skip");
      setStreak(0);
    }
    setFlipped((f) => !f);
  }

  function handleNextPokemon() {
    if (nextLocked || isLast) {
      return;
    }
    setCurrIdx(currIdx + 1);
    setFlipped(false);
    resetGuess();
  }

  function handlePreviousPokemon() {
    if (currIdx === 0 || (timed && !pokemon.revealed)) return;
    setCurrIdx(currIdx - 1);
    setFlipped(false);
    resetGuess();
  }

  function handleChangeTheme() {
    setThemeIdx((i) => (i + 1) % THEMES.length);
  }

  function handleGuess(e) {
    e.preventDefault();
    if (!guess.trim()) return;

    // 手機上送出後收起鍵盤，才看得到翻面或晃動
    if (isTouchDevice()) {
      guessInputRef.current.blur();
    }

    const isCorrect = normalize(guess) === normalize(pokemon.name);
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      if (!pokemon.revealed) {
        setCorrectCnt(correctCnt + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        setLongestStreak(Math.max(longestStreak, newStreak));
        markRevealed(currIdx, "correct");
      }
      setFlipped(true);
    } else {
      if(!pokemon.revealed) {
         setStreak(0);
      }
      setFlipped(false);
    }
  }

  function handleResetGame() {
    setSequence([]);
    setMastered([]);
    setFlipped(false);
    setCurrIdx(0);
    setStreak(0);
    setLongestStreak(0);
    setCorrectCnt(0);
    setRevealedCnt(0);
    setTotalGuess(0);
    setLevel("beginner");
    setShowHint(false);
    setMode("");
    setTimeLeft(TIME_LIMIT);
    setShowResult(false);
    resetGuess();
  }

  // 練習模式：目前這張不動，其他卡片重新洗牌
  function handleShuffle() {
    setSequence((s) => shuffleExcept(s, currIdx));
  }

  // 練習模式：把目前這張移到已精通清單
  function handleMaster() {
    const remaining = sequence.filter((_, i) => i !== currIdx);
    setSequence(remaining);
    setMastered([...mastered, pokemon]);

    // 拿掉的是最後一張就往前退一格；否則後面那張會補到目前的位置
    if (currIdx >= remaining.length) {
      setCurrIdx(Math.max(0, remaining.length - 1));
    }
    setFlipped(false);
    resetGuess();
  }

  function markRevealed(idx, guessResult) {
    setSequence((s) => {
      return s.map((p, i) =>
        i === idx
          ? { ...p, revealed: true, guessResult: p.guessResult ?? guessResult }
          : p,
      );
    });
    setRevealedCnt(revealedCnt + 1);
    setTimeLeft(TIME_LIMIT); // 這張揭曉了，計時器重設給下一張
  }

  function resetGuess() {
    setGuess("");
    setFeedback("");
  }

  return (
    <div
      className={`app ${timeStatus}`}
      style={{ "--wallpaper": `url("${theme.wallpaper}")` }}
    >
      <h1>Who's That Pokémon</h1>
      {mode === "" ? (
        <h2>Welcome, Trainer! Are you ready to test your Pokémon knowledge?</h2>
      ) : (
        ""
      )}
      <p className="stat">
        Number of Pokémons: {mode === "" ? pokemons.length : totalGuess}
      </p>
      {timed && !pokemon?.revealed && (
        <Timer timeLeft={timeLeft} timeTotal={TIME_LIMIT} />
      )}

      {sequence.length > 0 && !showResult ? (
        <div className="guess-container">
          {mode == "beginner" ? (
            <>
              <div className="guess-stat-row">
                <p className="stat">Cards left: {sequence.length}</p>
                <p className="stat">Mastered: {mastered.length}</p>
              </div>
            </>
          ) : (
            <div className="guess-stat-row">
              <p className="stat">Streak: {streak}</p>
              <p className="stat">Longest Streak: {longestStreak}</p>
              <p className="stat">
                Score: {score}
              </p>
              <p className="stat">
                Progress: {currIdx + 1 + " / " + totalGuess}{" "}
              </p>
            </div>
          )}

          <div className="card-row">
            <ArrowButton
              direction="left"
              disabled={isFirst || (timed && !pokemon.revealed)}
              onClick={handlePreviousPokemon}
            />

            <div
              className={`card ${timeStatus} ${flipped ? "is-flipped" : ""} ${feedback ? feedback : ""}`}
              onClick={handleManualReveal}
              onAnimationEnd={() => setFeedback("")}
            >
              {/* Card front */}
              <div className="card-face card-front">
                {pokemon.type.map((t) => (
                  <div className={`type-container ${t.toLowerCase()}`}></div>
                ))}

                <div className="card-content">
                  {showHint && (
                    <img
                      className="pokemon-image"
                      src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokemon.pokedexNumber}.png`}
                      draggable="false"
                    />
                  )}

                  <div className="text-container">
                    <p>
                      Type:{" "}
                      <div className="type-row">
                        {pokemon.type.map((t) => (
                          <span
                            key={t}
                            className={`type-badge ${t.toLowerCase()}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </p>
                    <p>Generation: {pokemon.generation}</p>
                    <p>Evolution: {pokemon.evolution}</p>
                    <p>{pokemon.pokedexEntry}</p>
                  </div>
                </div>
              </div>

              {/* Card back */}
              <div className="card-face card-back">
                {pokemon.type.map((t) => (
                  <div className={`type-container ${t.toLowerCase()}`}></div>
                ))}

                <div className="card-content">
                  {flipped && (
                    <img
                      className="pokemon-image"
                      src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokemon.pokedexNumber}.png`}
                      draggable="false"
                    />
                  )}

                  <div className="text-container">
                    <p>Name: {flipped && pokemon.name}</p>
                    <p>
                      Type:{" "}
                      <div className="type-row">
                        {pokemon.type.map((t) => (
                          <span
                            key={t}
                            className={`type-badge ${t.toLowerCase()}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </p>
                    <p>Generation: {pokemon.generation}</p>
                    <p>Evolution: {pokemon.evolution}</p>
                    <p>{pokemon.pokedexEntry}</p>
                  </div>
                </div>
              </div>
            </div>
            <ArrowButton
              direction="right"
              disabled={isLast || nextLocked}
              onClick={handleNextPokemon}
            />
          </div>
          {mode != "beginner" && (
            <form id="guess-form" className="guess-form" onSubmit={handleGuess}>
              <div className="input-row">
                <label htmlFor="guess">Guess the Pokémon: </label>
                <input
                  id="guess"
                  ref={guessInputRef}
                  className={`input ${feedback}`}
                  type="text"
                  placeholder="Who am I..."
                  value={guess}
                  onChange={(e) => {
                    setGuess(e.target.value);
                    setFeedback("");
                  }}
                  onFocus={() => {
                    scrollYRef.current = window.scrollY;
                  }}
                  onBlur={() => {
                    if (isTouchDevice()) {
                      window.scrollTo({
                        top: scrollYRef.current,
                        behavior: "smooth",
                      });
                    }
                  }}
                ></input>
              </div>
            </form>
          )}

          <div className="button-row">
            <ArrowButton
              direction="left"
              disabled={isFirst || (timed && !pokemon.revealed)}
              onClick={handlePreviousPokemon}
            />
            {mode != "beginner" && (
              <button className="submit-button" type="submit" form="guess-form">
                Check!
              </button>
            )}
            {hintEnabled && (
              <button
                type="button"
                className="submit-button"
                onClick={() => setShowHint((s) => !s)}
              >
                {!showHint ? "Show Hint" : "Hide Hint"}
              </button>
            )}
            {isGameOver && (
              <button
                className="submit-button"
                type="button"
                onClick={() => setShowResult(true)}
              >
                Show Result
              </button>
            )}
            {mode == "beginner" && (
              <button
                className="submit-button"
                type="button"
                onClick={handleShuffle}
              >
                Shuffle
              </button>
            )}
            {mode == "beginner" && (
              <button
                className="submit-button"
                type="button"
                onClick={handleMaster}
              >
                Mastered 
              </button>
            )}
            <ArrowButton
              direction="right"
              disabled={isLast || nextLocked}
              onClick={handleNextPokemon}
            />
          </div>
        </div>
      ) : (
        ""
      )}


      {isGameOver && (mode === "beginner" || showResult) && (
        <p className="stat">
          {mode === "beginner"
            ? "You've mastered every card!! 🎉"
            : "You've completed every challenge!! 🔥"}
        </p>
      )}

      {isGameOver && showResult && 
        <div className="result-stat-row">
              <p className="stat">Longest Streak: {longestStreak}</p>
              <p className="stat">
                Score: {score}
              </p>
        </div>
      }

      {mode == "beginner" && totalGuess != 0 && mastered.length > 0 && (
        <div className="list">
          <p className="stat">Mastered Pokémon:</p>
          <div className="chips">
            {mastered.map((p) => (
              <span key={p.pokedexNumber} className="chip">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {mode != "beginner" && showResult && (
        <div className="list">
          <p className="stat">Pokémon Encountered:</p>
          <div className="chips">
            {sequence.map((p) => (
              <span
                key={p.pokedexNumber}
                className={`chip ${p.guessResult}`}
              >
                {RESULT_ICON[p.guessResult]} {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {mode == "" ? (
        <form className="init-form" onSubmit={handleInit}>
          <div className="mode-row">
            {["beginner", "intermediate", "advanced", "master"].map((lv) => (
              <ModeButton
                key={lv}
                src={theme.levels[lv]}
                selected={level === lv}
                onClick={() => setLevel(lv)}
              >
                {lv[0].toUpperCase() + lv.slice(1)}
              </ModeButton>
            ))}
          </div>
          <p className="level-description">{LEVEL_INFO[level]}</p>

          <label htmlFor="total-guess">Choose the number of cards: </label>
          <div className="input-row">
            <input
              id="total-guess"
              ref={initInputRef}
              className={`input ${feedback}`}
              type="number"
              placeholder="Enter the number..."
              min={1}
              max={pokemons.length}
              step="1"
              onFocus={() => {
                scrollYRef.current = window.scrollY;
              }}
              onBlur={() => {
                if (isTouchDevice()) {
                  window.scrollTo({
                    top: scrollYRef.current,
                    behavior: "smooth",
                  });
                }
              }}
            ></input>
            <button className="submit-button" type="submit">
              Go!
            </button>
          </div>
        </form>
      ) : (
        ""
      )}

      <div className="util-row">
        <button className="submit-button" onClick={handleChangeTheme}>
          Change Theme
        </button>
        {mode != "" && !isGameOver && 
        <button className="submit-button" onClick={handleResetGame}>
          Quit Game
        </button>
        }
        {
        ((mode === "beginner" && isGameOver) || 
        (showResult)) && 
         <button className="submit-button" type="button" onClick={()=> {
          handleResetGame();
          setLevel(mode);
        }}>Play Again</button>
      }
      </div>

      {/* <div className="pokemon-silhouette">
        <img
          src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/130.png"
          className="pokemon top"
        />
        <img
          src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/130.png"
          className="pokemon bottom"
        />
      </div> */}
    </div>
  );
};

export default App;
