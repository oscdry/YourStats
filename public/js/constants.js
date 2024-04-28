export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export const subjectRegex = /^[a-zA-Z0-9_ ]{3,500}$/;

export const validateUsername = (username) => usernameRegex.test(username);
export const validateEmail = (email) => emailRegex.test(email);
export const validatePassword = (password) => passwordRegex.test(password);

export const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));