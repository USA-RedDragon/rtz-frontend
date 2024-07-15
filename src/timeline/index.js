import store from '../store';

/**
 * Get current playback offset
 *
 * @param {object} state
 * @returns {number}
 */
export function currentOffset(state = null) {
  if (!state) {
    state = store.getState();
  }

  /** @type {number} */
  let offset;
  if (state.app.offset === null && state.app.loop?.startTime) {
    offset = state.app.loop.startTime;
  } else {
    const playSpeed = state.app.isBufferingVideo ? 0 : state.app.desiredPlaySpeed;
    offset = state.app.offset + ((Date.now() - state.app.startTime) * playSpeed);
  }

  if (offset !== null && state.app.loop?.startTime) {
    // respect the loop
    const loopOffset = state.app.loop.startTime;
    if (offset < loopOffset) {
      offset = loopOffset;
    } else if (offset > loopOffset + state.app.loop.duration) {
      offset = ((offset - loopOffset) % state.app.loop.duration) + loopOffset;
    }
  }
  return offset;
}
