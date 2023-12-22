const dinoElem = document.querySelector("[data-dino]");
import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2; // because there are two dino images
const FRAME_TIME = 100; //every single frame lasts 100ms - change animation 10 diff times

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;
/**
 * Sets up the dino position
 */
export function setupDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, "--bottom", 0);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
}

/**
 *
 * @param {delta} delta
 * @param {speedScale} speedScale
 */
export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

/**
 * Changes the image to a lose image
 */
export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png";
}

/**
 * Helps move the dino
 * @param {delta} delta
 * @param {speedScale} speedScale
 * */
function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = "imgs/dino-stationary.png";
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    //make sure that frames loop
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME; //reset the current frame
  }

  //as the game gets quicker the animation must get faster
  currentFrameTime += delta * speedScale;
}

/**
 * Handle the jumping motion of the dino
 * @param {delta} delta
 * @returns
 */
function handleJump(delta) {
  if (!isJumping) {
    return;
  }

  //move the position of the dino up or down
  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  // if the dino
  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

/**
 * Handle the space key click for jumping
 * @param {event} e triggered by clicking space key
 * @returns
 */
function onJump(e) {
  if (e.code !== "Space" || isJumping) {
    return;
  }

  yVelocity = JUMP_SPEED;
  isJumping = true;
}

/**
 *
 * @returns Get the dino as  a rectangle
 */
export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}
