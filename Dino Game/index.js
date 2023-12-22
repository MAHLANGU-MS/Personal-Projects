import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js";
import { setupGround, updateGround } from "./ground.js";
import { setupCactus, updateCactus, getCactusRect } from "./cactus.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.0001;

const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true }); // handleStart only runs once

setupGround();

let lastTime = 0;
let speedScale;
let score;

/**
 * Updates the positions of the elements of the game
 * @param {time} time since the start of the game
 */
function update(time) {
  //to make the function call itself over and over again

  //get the time between updates
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  //update the ground
  updateGround(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

/**
 * Updates speed scale
 * @param {speedScale} speedScale
 */
function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

/**
 * Updates the score
 * @param {delta} delta
 */
function updateScore(delta) {
  score += delta * 0.01; //for every second, add 10
  scoreElem.textContent = Math.floor(score);
}

/**
 * Handles the starting of the game - initialises variables and elements of the game
 */
function handleStart() {
  //when the game is lost restart the lastTime
  lastTime = null;
  setupGround();
  setupDino();
  setupCactus();
  speedScale = 1;
  score = 0;
  startScreenElem.classList.add("hide");
  //only call update when there is something to update
  window.requestAnimationFrame(update);
}

/**
 * Handles when the player loses
 */
function handleLose() {
  setDinoLose();
  //after losing
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    startScreenElem.classList.remove("hide");
  }, 100);
}

/**
 * Set the pixels to world scale
 */
function setPixelToWorldScale() {
  let worldToPixelScale;

  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.computedStyleMap.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.computedStyleMap.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

/**
 * Checks if the game is lost
 * @returns
 */
function checkLose() {
  const dinoRect = getDinoRect();
  //if any cactus returns true for this function, every element will return true
  return getCactusRect().some((rect) => isCollision(rect, dinoRect));
}

/**
 * Checks if the dino has made contact with a cactus
 * @param {rect1} rect1 -  rectangle
 * @param {*} rect2 -  rectangle
 * @returns
 */
function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}
