import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import InitialStateProps from './initialprops';

export type AppThunk = ThunkAction<void, InitialStateProps, unknown, Action>;
