// src/lib/api.js
export const BASE_URL = "https://panel.huesandharvest.com/api/";

export const ENDPOINTS = {
  LOGIN: `${BASE_URL}login_token.php`,
  VALIDATE: `${BASE_URL}validate_token.php`,
  REFRESH: `${BASE_URL}refresh_token.php`,
  LOGOUT: `${BASE_URL}logout.php`,
};
