/* eslint-env jest */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import DriveListItem from './DriveListItem';
import { Provider } from 'react-redux';

const defaultState = {
  app: {
    start: Date.now(),
  },
};

jest.mock('../Timeline');

const store = configureStore({
  reducer: (state) => {
    if (!state) {
      return { ...defaultState };
    }
    return state;
  },
  middleware: () => [thunk],
});

describe('drive list items', () => {
  it('has DriveEntry class', () => {
    render(<Provider store={store}>
      <DriveListItem
      drive={{
        start_time_utc_millis: 1570830798378,
        end_time_utc_millis: 1570830798378 + 1234,
        length: 12.5212,
        startCoord: [0, 0],
        endCoord: [0, 0],
      }}
    /></Provider>);
    expect(screen.getByRole('link')).toHaveClass('DriveEntry');
  });
});
