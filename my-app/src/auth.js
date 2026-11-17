// Temp auth prototype

import credentialsText from "./credentials.txt?raw";

const AUTH_SESSION_KEY = "coursecraft_prototype_logged_in";

function parseCredentials(text) {
  const credentials = {};

  text.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    credentials[key] = value;
  });

  return credentials;
}

const VALID_CREDENTIALS = parseCredentials(credentialsText);

export function isLoggedIn() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
}

export function login(username, password) {
  const isValid =
    username === VALID_CREDENTIALS.username &&
    password === VALID_CREDENTIALS.password;

  if (isValid) {
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
  }

  return isValid;
}

export function logout() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
