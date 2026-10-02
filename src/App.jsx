import { useState, useRef, useEffect } from "react";
import "./App.css";
import { pokemons } from "./data/pokemon";
import pokeball from "./assets/pokeball.webp";
import greatball from "./assets/greatball.webp";
import ultraball from "./assets/ultraball.webp";
import pokeballRed from "./assets/pokeball-red.png";
import pokeballBlue from "./assets/pokeball-blue.png";
import pokeballYellow from "./assets/pokeball-yellow.png";
import wallpaper1 from "./assets/wallpaper1.png";
import wallpaper2 from "./assets/wallpaper2.svg";
import arrow from ".//assets/arrow.png";

const THEMES = [
  {
    name: "classic",
    wallpaper: wallpaper1,
    balls: { hint: pokeball, theme: greatball, reset: ultraball },
  },
  {
    name: "modern",
    wallpaper: wallpaper2,
    balls: { hint: pokeballRed, theme: pokeballBlue, reset: pokeballYellow },
  },
];

function getRandomPokemon() {
  const idx = Math.floor(Math.random() * pokemons.length);
  const selectedPokemon = pokemons[idx];

  return {
    ...selectedPokemon,
    pokedexNumber: selectedPokemon.pokedexNumber.toString().padStart(3, "0"),
  };
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
  const [sequence, setSequence] = useState(() => [getRandomPokemon()]);
  const [totalGuess, setTotalGuess] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [correctCnt, setCorrectCnt] = useState(0);

  const guessInputRef = useRef(null);
  const initInputRef = useRef(null);
  const scrollYRef = useRef(0); // 鍵盤出現前的捲動位置

  useEffect(() => {
    function handleKeyDown(e) {
      if (totalGuess === 0) return;
      const typing = e.target.tagName === "INPUT";
      if (typing && (e.key === "ArrowLeft" || e.key === "ArrowRight") && !flipped) return;
      

      if (e.key === "ArrowUp") {
        e.preventDefault();
        // markRevealed(currIdx);
        // setFlipped(true); // ↑ 翻到背面看答案
        handleReveal();
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
  const isFirst = currIdx == 0;
  const isLast = currIdx == totalGuess - 1;

  const theme = THEMES[themeIdx];

  function handleInit(e) {
    e.preventDefault();

    const value = Number(initInputRef.current.value);

    if (isTouchDevice()) {
      initInputRef.current.blur();
    }
    setTotalGuess(value);
  }

  function handleReveal() {
    if(!pokemon.revealed) {
      markRevealed(currIdx);
      setStreak(0);
    }
    setFlipped((f) => !f);
  }

  function handleNextPokemon() {
    if (currIdx == totalGuess - 1 && flipped) {
      alert(
        `Your score is ${((correctCnt / totalGuess) * 100).toFixed(2) + "%"}`,
      );
    }
    if (currIdx === totalGuess - 1) return;

    resetGuess();
    if (currIdx < sequence.length - 1) {
      setCurrIdx(currIdx + 1);
      setFlipped(false);
      return;
    }

    const next = getRandomPokemon();
    setSequence((s) => [...s, next]);
    setCurrIdx(sequence.length);
    setFlipped(false);
  }

  function handlePreviousPokemon() {
    if (currIdx === 0) return;
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
      }
      setFlipped(true);
      markRevealed(currIdx);
    } else {
      setStreak(0);
      setFlipped(false);
    }
  }

  function handleResetGame() {
    setSequence([getRandomPokemon()]);
    setFlipped(false);
    setCurrIdx(0);
    setStreak(0);
    setLongestStreak(0);
    setCorrectCnt(0);
    setTotalGuess(0);
    resetGuess();
  }

  function markRevealed(idx) {
    setSequence((s) => {
      return s.map((p, i) => i === idx ? {...p, revealed: true} : p)
    })
  }

  function resetGuess() {
    setGuess("");
    setFeedback("");
  }

  return (
    <div className="app" style={{ "--wallpaper": `url("${theme.wallpaper}")` }}>
      <h1>Who's That Pokémon</h1>
      <h2>Welcome, Trainer! Are you ready to test your Pokémon knowledge?</h2>
      <p className="stat">Number of Pokémons: {pokemons.length}</p>
      {totalGuess != 0 ? (
        <div className="guess-container">
          <div className="guess-stat-row">
            <p className="stat">Streak: {streak}</p>
            <p className="stat">Longest Streak: {longestStreak}</p>
            <p className="stat">
              Score: {((correctCnt / totalGuess) * 100).toFixed(2) + "%"}
            </p>
            <p className="stat">
              Progress: {currIdx + 1 + " / " + totalGuess}{" "}
            </p>
          </div>
          <div className="card-row">
            <img
              className={`button arrow arrow-left ${isFirst ? "is-end" : ""}`}
              src={arrow}
              onClick={handlePreviousPokemon}
              draggable="false"
            ></img>

            <div
              className={`card ${flipped ? "is-flipped" : ""} ${feedback ? feedback : ""}`}
              onClick={handleReveal}
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
            <img
              className={`button arrow arrow-right ${isLast ? "is-end" : ""}`}
              src={arrow}
              onClick={handleNextPokemon}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  handleNextPokemon();
                }
              }}
              draggable="false"
            ></img>
          </div>

          <form className="guess-form" onSubmit={handleGuess}>
            <label htmlFor="guess">Guess the Pokémon: </label>
            <div className="input-row">
              <img
                className={`button arrow arrow-left ${isFirst ? "is-end" : ""}`}
                src={arrow}
                onClick={handlePreviousPokemon}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    handlePreviousPokemon();
                  }
                }}
                draggable="false"
              ></img>

              <input
                id="guess"
                ref={guessInputRef}
                className={`guess-input ${feedback}`}
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
              <button className="submit-button" type="submit">
                Check!
              </button>
              <img
                className={`button arrow arrow-right ${isLast ? "is-end" : ""}`}
                src={arrow}
                onClick={handleNextPokemon}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    handleNextPokemon();
                  }
                }}
                draggable="false"
              ></img>
            </div>
          </form>
        </div>
      ) : (
        ""
      )}
      {totalGuess == 0 ? (
        <form className="init-form" onSubmit={handleInit}>
          <label htmlFor="total-guess">Choose the number of challenges: </label>
          <div className="input-row">
            <input
              id="total-guess"
              ref={initInputRef}
              className={`guess-input ${feedback}`}
              type="number"
              // defaultValue={10}
              placeholder="Enter the number..."
              min={10}
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
        <img
          title="Show hint"
          className="button ball"
          src={theme.balls.hint}
          onClick={() => setShowHint((s) => !s)}
        />
        <img
          title="Change Theme"
          className="button ball"
          src={theme.balls.theme}
          onClick={handleChangeTheme}
        />
        <img
          title="Reset Game"
          className="button ball"
          src={theme.balls.reset}
          onClick={handleResetGame}
        />
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
