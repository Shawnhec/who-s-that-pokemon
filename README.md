# Web Development Project 3 - *Who's That Pokémon*

Submitted by: **Shawn Chiu**

This web app: **A Pokémon guessing game inspired by the classic anime segment. Each card shows only clues (type, generation, evolution stage, and Pokédex entry) and you type the Pokémon's name to guess it. Pick one of four difficulty levels, choose how many cards to play, and work through a deck drawn from all 1,025 Pokémon with no repeats.**

Time spent: **30+** hours spent in total

Live demo: https://shawnhec.github.io/who-s-that-pokemon/

## Required Features

The following **required** functionality is completed:

- [x] **The user can enter their guess into an input box *before* seeing the flipside of the card**
  - Application features a clearly labeled input box with a submit button where users can type in a guess
  - Clicking on the submit button with an **incorrect** answer shows visual feedback that it is wrong
  -  Clicking on the submit button with a **correct** answer shows visual feedback that it is correct
  - *Guessing is available in Intermediate, Advanced, and Master. The "Guess the Pokémon:" input has a **Check!** button. A wrong guess turns the input red and shakes the card; a correct guess turns the input green and flips the card to reveal the answer.*
- [x] **The user can navigate through an ordered list of cards**
  - A forward/next button displayed on the card navigates to the next card in a set sequence when clicked
  - A previous/back button displayed on the card returns to the previous card in the set sequence when clicked
  - Both the next and back buttons should have some visual indication that the user is at the beginning or end of the list (for example, graying out and no longer being available to click), not allowing for wrap-around navigation
  - *The whole deck is drawn when the game starts, so the order stays fixed. The arrow buttons fade out and stop responding on the first and last card.*

The following **optional** features are implemented:


- [x] Users can use a shuffle button to randomize the order of the cards
  - Cards should remain in the same sequence (**NOT** randomized) unless the shuffle button is clicked
  - Cards should change to a random sequence once the shuffle button is clicked
  - *Available in Beginner. Shuffle keeps the current card in place and reorders all the others.*
- [x] A user’s answer may be counted as correct even when it is slightly different from the target answer
  - Answers are considered correct even if they only partially match the answer on the card
  - Examples: ignoring uppercase/lowercase discrepancies, ignoring punctuation discrepancies, matching only for a particular part of the answer rather than the whole answer
  - *Answers ignore uppercase/lowercase, spaces, and punctuation, so `mr mime`, `MR. MIME`, and `Mr. Mime` all count as correct.*
- [x] A counter displays the user’s current and longest streak of correct responses
  - The current counter increments when a user guesses an answer correctly
  - The current counter resets to 0 when a user guesses an answer incorrectly
  - A separate counter tracks the longest streak, updating if the value of the current streak counter exceeds the value of the longest streak counter
  - *Shown in Intermediate, Advanced, and Master. Giving up on a card also resets the current streak.*
- [x] A user can mark a card that they have mastered and have it removed from the pool of displayed cards
  - The user can mark a card to indicate that it has been mastered
  - Mastered cards are removed from the pool of displayed cards and added to a list of mastered cards
  - *Available in Beginner. The **Mastered ✓** button removes the card from the deck and adds it to the "Mastered Pokémon" list below the game.*


The following **additional** features are implemented:

* [x] Four difficulty levels, each with a description on the start screen:
  * **Beginner:** practice mode with no score, hints, Shuffle, and Mastered
  * **Intermediate:** scored, hints available, and each card must be answered or given up before moving on
  * **Advanced:** scored, no hints, and each card must be answered or given up before moving on
  * **Master:** like Advanced, plus a 15-second countdown per card
* [x] The player chooses how many cards to play, and a deck never contains the same Pokémon twice
* [x] Master mode countdown with a progress bar that turns from green to yellow to red, and the screen pulses red when time is almost up. When time runs out, the card flips and the streak resets
* [x] Score percentage and progress counter during scored games
* [x] Results screen with the score, longest streak, and a "Pokémon Encountered" list marking each card as ✓ correct, ✗ given up, or ⏱ timed out
* [x] Play Again returns to the start screen with the same level selected
* [x] Hint button that shows the Pokémon's silhouette
* [x] Clicking the card flips it in 3D to reveal the answer (in scored modes this counts as giving up)
* [x] Keyboard shortcuts: ← / → to move between cards, ↑ to reveal the card (counts as giving up), ↓ to flip it back
* [x] Two switchable themes with different wallpapers and Poké Ball buttons
* [x] Responsive layout for phones, including restoring the scroll position after the on-screen keyboard closes
* [x] Deployed on GitHub Pages

## Video Walkthrough

Here's a walkthrough of implemented user stories:

First part of the project:
[![Video Walkthrough](https://img.youtube.com/vi/gznGsHgDWsw/maxresdefault.jpg)](https://youtu.be/gznGsHgDWsw)
URL: https://youtu.be/gznGsHgDWsw?si=yG9kRCeCl0Y7zxMm

Second part of the project:
[![Video Walkthrough](https://img.youtube.com/vi/2_ZMEvlKzQA/maxresdefault.jpg)](https://youtu.be/2_ZMEvlKzQA)(https://youtu.be/2_ZMEvlKzQA)
URL: https://youtu.be/2_ZMEvlKzQA?si=yG9kRCeCl0Y7zxMm


<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

Describe any challenges encountered while building the app.

* **State updates are not immediate.** After calling `setStreak(streak + 1)`, the next line still saw the old `streak`, so the longest streak was always one behind. I fixed it by calculating the new value first and using it for both updates.
* **Building the countdown timer.** The timer uses a `useEffect` that schedules one-second `setTimeout`s and clears them in the cleanup function. Without the cleanup, an old timer kept running after the player answered or switched cards. I also had to stop players from pausing the timer by going back to an earlier card.
* **Preventing score exploits.** At first, players could earn points on the same card more than once, or peek at the answer and then guess it. Each card now stores whether it has been revealed, and only the first correct guess on an unrevealed card counts. Because this flag lives on the card itself, it stays correct after the deck is shuffled.
* **Blank-screen crashes.** Several times the whole page went blank because the card tried to read data before a game had started. Rendering the game area only when the deck has cards fixed this.
* **CSS animations conflicting.** The card's flip uses `transform`, so the shake animation uses the separate `translate` property to avoid overriding it. On the level buttons, the scaled Poké Ball image was drawn on top of its label until I gave the label `position: relative` and a `z-index`.

## License

    Copyright 2026 Shawn Chiu

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
