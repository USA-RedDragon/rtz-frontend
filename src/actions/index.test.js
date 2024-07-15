/* eslint-env jest */
import { push } from 'redux-first-history';
import { pushTimelineRange } from './index';

jest.mock('redux-first-history', () => {
  const originalModule = jest.requireActual('redux-first-history');
  return {
    __esModule: true,
    ...originalModule,
    push: jest.fn(),
  };
});

describe('timeline actions', () => {
  it('should push history state when editing zoom', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const actionThunk = pushTimelineRange("log_id", 123, 1234);

    getState.mockImplementationOnce(() => ({
      app: {
        dongleId: 'statedongle',
        loop: {},
        zoom: {},
      },
    }));
    actionThunk(dispatch, getState);
    expect(push).toBeCalledWith('/statedongle/log_id');
  });
});
