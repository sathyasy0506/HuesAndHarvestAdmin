export const BASE_URL = "https://panel.huesandharvest.com/";

export const ENDPOINTS = {
  VALIDATE: () => `${BASE_URL}validate.php`,
  LOGIN: `${BASE_URL}login_token.php`,
  REFRESH: `${BASE_URL}refresh_token.php`,
  LOGOUT: `${BASE_URL}logout.php`,
};
