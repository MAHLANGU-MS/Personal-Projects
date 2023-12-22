import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const groundElems = document.querySelectorAll("[data-ground]");
const SPEED = 0.05;

/**
 * Called at the start of the program
 */
export function setupGround() {
  setCustomProperty(groundElems[0], "--left", 0);
  setCustomProperty(groundElems[1], "--left", 300);
  //300 to setup a ground that is twice as long
}

/**
 *
 * @param {delta} delta
 * @param {speedScale} speedScale scale of the game speed to speed the game up - constantly increasing
 */
export function updateGround(delta, speedScale) {
  groundElems.forEach((ground) => {
    //multiply by -1 so that it moves to the left
    //incr ground pos everytime update is called
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1);

    // If the forst ground element as moved all the way across the screen then add 300
    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600);
    }
  });
}
