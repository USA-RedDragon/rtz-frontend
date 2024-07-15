// basic helper functions for controlling playback
// we shouldn't want to edit the raw state most of the time, helper functions are better
import * as Types from '../actions/types';
import { currentOffset } from '.';

export function reducer(state, action) {
  let loopOffset = null;
  if (state.app && state.app.loop && state.app.loop.startTime !== null) {
    loopOffset = state.app.loop.startTime;
  }
  switch (action.type) {
    case Types.ACTION_SEEK:
      state = {
        app: {
          ...state.app,
          offset: action.offset,
          startTime: Date.now(),
        }
      };

      if (loopOffset !== null) {
        if (state.app.offset < loopOffset) {
          state.app.offset = loopOffset;
        } else if (state.app.offset > (loopOffset + state.app.loop.duration)) {
          state.app.offset = loopOffset + state.app.loop.duration;
        }
      }
      break;
    case Types.ACTION_PAUSE:
      state = {
        app: {
          ...state.app,
          offset: currentOffset(state),
          startTime: Date.now(),
          desiredPlaySpeed: 0,
        },
      };
      break;
    case Types.ACTION_PLAY:
      if (action.speed !== state.app.desiredPlaySpeed) {
        state = {
          app: {
            ...state.app,
            offset: currentOffset(state),
            desiredPlaySpeed: action.speed,
            startTime: Date.now(),
          },
        };
      }
      break;
    case Types.ACTION_LOOP:
      if (action.start !== null && action.start !== undefined && action.end !== null && action.end !== undefined) {
        state.app.loop = {
          startTime: action.start,
          duration: action.end - action.start,
        };
      } else {
        state.app.loop = null;
      }
      break;
    case Types.ACTION_BUFFER_VIDEO:
      state = {
        app: {
          ...state.app,
          isBufferingVideo: action.buffering,
          offset: currentOffset(state),
          startTime: Date.now(),
        },
      };
      break;
    case Types.ACTION_RESET:
      state = {
        app: {
          ...state.app,
          desiredPlaySpeed: 1,
          isBufferingVideo: true,
          offset: 0,
          startTime: Date.now(),
        },
      };
      break;
    default:
      break;
  }

  if (state.app && state.app.currentRoute && state.app.currentRoute.videoStartOffset && state.app.loop && state.app.zoom
    && state.app.loop.startTime === state.app.zoom.start && state.app.zoom.start === 0) {
    const loopRouteOffset = state.app.loop.startTime - state.app.zoom.start;
    if (state.app.currentRoute.videoStartOffset > loopRouteOffset) {
      state.app.loop = {
        startTime: state.app.zoom.start + state.app.currentRoute.videoStartOffset,
        duration: state.app.loop.duration - (state.app.currentRoute.videoStartOffset - loopRouteOffset),
      };
    }
  }

  // normalize over loop
  if (state.app && state.app.offset !== null && state.app.loop?.startTime) {
    const playSpeed = state.app.isBufferingVideo ? 0 : state.app.desiredPlaySpeed;
    const offset = state.app.offset + (Date.now() - state.app.startTime) * playSpeed;
    loopOffset = state.app.loop.startTime;
    // has loop, trap offset within the loop
    if (offset < loopOffset) {
      state.app.startTime = Date.now();
      state.app.offset = loopOffset;
    } else if (offset > loopOffset + state.app.loop.duration) {
      state.app.offset = ((offset - loopOffset) % state.app.loop.duration) + loopOffset;
      state.app.startTime = Date.now();
    }
  }

  if (state.app) {
    state.app.isBufferingVideo = Boolean(state.app.isBufferingVideo);
  }

  return state;
}

// seek to a specific offset
export function seek(offset) {
  return {
    type: Types.ACTION_SEEK,
    offset,
  };
}

// pause the playback
export function pause() {
  return {
    type: Types.ACTION_PAUSE,
  };
}

// resume / change play speed
export function play(speed = 1) {
  return {
    type: Types.ACTION_PLAY,
    speed,
  };
}

export function selectLoop(start, end) {
  return {
    type: Types.ACTION_LOOP,
    start,
    end,
  };
}

// update video buffering state
export function bufferVideo(buffering) {
  return {
    type: Types.ACTION_BUFFER_VIDEO,
    buffering,
  };
}

export function resetPlayback() {
  return {
    type: Types.ACTION_RESET,
  };
}
