import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AppDispatch, RootState, AppStore } from '../theme/themeprovider';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
