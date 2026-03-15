import { createContext, useContext, useMemo, useReducer } from 'react';

const initialState = {
  auth: { user: null, role: null, token: null },
  location: { state: '', city: '', area: '', locality: '', pincode: '' }
};

const AppStateContext = createContext(initialState);
const AppDispatchContext = createContext(() => undefined);

const reducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_SET':
      return { ...state, auth: action.payload };
    case 'LOCATION_SET':
      return { ...state, location: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const memoState = useMemo(() => state, [state]);
  return (
    <AppStateContext.Provider value={memoState}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);
