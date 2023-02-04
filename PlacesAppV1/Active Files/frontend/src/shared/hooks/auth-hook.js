import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
   
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem('userData', JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() }));
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null);
      setUserId(null);
      localStorage.removeItem('userData');
    }, []);
    // checking if you have token and a token expiration date
    useEffect (() => {
      if (token && tokenExpirationDate) {
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime)
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpirationDate]);
  
    // Keep user logged in without having to refresh page
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
      }
    }, [login]);
    return { token, login, logout, userId };
};