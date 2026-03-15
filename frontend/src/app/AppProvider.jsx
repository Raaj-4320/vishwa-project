import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../services/firebase.js';
import { api, setAuthToken } from '../services/api.js';

const initialState = {
  auth: { user: null, role: null, token: null, profile: null },
  authLoading: true,
  location: { state: '', city: '', area: '', locality: '', pincode: '' }
};

const AppStateContext = createContext(initialState);
const AppDispatchContext = createContext(() => undefined);

const reducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_SET':
      return { ...state, auth: action.payload, authLoading: false };
    case 'AUTH_LOADING':
      return { ...state, authLoading: action.payload };
    case 'LOCATION_SET':
      return { ...state, location: action.payload };
    default:
      return state;
  }
};

export const roleHomePath = (role) => {
  if (role === 'seller' || role === 'pharmacist') return '/seller';
  if (role === 'admin' || role === 'super_admin') return '/admin';
  if (role === 'delivery') return '/delivery';
  return '/customer';
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      dispatch({ type: 'AUTH_LOADING', payload: true });
      if (!fbUser) {
        setAuthToken(null);
        dispatch({ type: 'AUTH_SET', payload: { user: null, role: null, token: null, profile: null } });
        return;
      }

      const token = await fbUser.getIdToken();
      setAuthToken(token);

      try {
        const me = await api.get('/users/me');
        dispatch({
          type: 'AUTH_SET',
          payload: {
            user: { uid: fbUser.uid, email: fbUser.email },
            token,
            role: me.data?.data?.role || 'customer',
            profile: me.data?.data || null
          }
        });
      } catch {
        dispatch({
          type: 'AUTH_SET',
          payload: { user: { uid: fbUser.uid, email: fbUser.email }, token, role: 'customer', profile: null }
        });
      }
    });
    return () => unsub();
  }, []);

  const memoState = useMemo(() => state, [state]);
  return (
    <AppStateContext.Provider value={memoState}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);
