export const setAuthStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export const getAuthStorage = (key: string) => {
  return window.localStorage.getItem(key);
};

export const removeAuthStorage = (key: string) => {
  window.localStorage.removeItem(key);
};

// --- SETTERS ---
export const SET_AUTH_TOKEN = (value: string) => {
  setAuthStorage("AUTH_TOKEN", value);
};

export const SET_AUTH_USER_ID = (value: string) => {
  setAuthStorage("AUTH_USER_ID", value);
};

export const SET_AUTH_ACCOUNT_ID = (value: string) => {
  setAuthStorage("AUTH_ACCOUNT_ID", value);
};

export const SET_AUTH_FIRSTNAME = (value: string) => {
  setAuthStorage("AUTH_FIRSTNAME", value);
};

export const SET_AUTH_LASTNAME = (value: string) => {
  setAuthStorage("AUTH_LASTNAME", value);
};

export const SET_AUTH_EMAIL = (value: string) => {
  setAuthStorage("AUTH_EMAIL", value);
};

// --- GETTERS ---
export const AUTH_TOKEN = () => {
  return getAuthStorage("AUTH_TOKEN"); // Added return!
};

export const AUTH_USER_ID = () => {
  return getAuthStorage("AUTH_USER_ID"); // Added return!
};

export const AUTH_ACCOUNT_ID = () => {
  return getAuthStorage("AUTH_ACCOUNT_ID"); // Added return!
};

export const AUTH_COMPANY_ID = () => {
  return getAuthStorage("AUTH_COMPANY_ID"); // Added return!
};

export const AUTH_COMPANY_NAME = () => {
  return getAuthStorage("AUTH_COMPANY_NAME"); // Added return!
};

export const AUTH_FIRSTNAME = () => {
  return getAuthStorage("AUTH_FIRSTNAME"); // Added for completeness
};

export const AUTH_LASTNAME = () => {
  return getAuthStorage("AUTH_LASTNAME"); // Added for completeness
};

export const AUTH_EMAIL = () => {
  return getAuthStorage("AUTH_EMAIL"); // Added for completeness
};
