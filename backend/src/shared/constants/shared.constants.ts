export const PORT = process.env.PORT || 3000;

export const ACCESS_TOKEN_MINUTE_SIGN_RELATIVE = '24h';
export const ACCESS_TOKEN_MINUTE_SIGN_NOMINAL = 1000 * 60 * 60 * 24;
export const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'some_secret_key';

export const APP_FRONTEND_URL = process.env.APP_FRONTEND_URL || 'http://localhost:5173';

export const REFRESH_TOKEN_MINUTE_SIGN_RELATIVE = '8h';
export const REFRESH_TOKEN_MINUTE_SIGN_NOMINAL = 1000 * 60 * 60 * 8;
export const REFRESH_TOKEN_SECRET =
	process.env.JWT_SECRET_REFRESH || 'some_secret_refresh_key';
