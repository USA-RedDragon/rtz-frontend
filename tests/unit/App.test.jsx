import React from 'react';
import { test, describe } from 'vitest';
import { act, render } from '@testing-library/react';
import App from '../../src/App';

describe('App', () => {
  test('should not crash', () => {
    act(() => {
      render(<App />);
    });
  }, 1000);
});
