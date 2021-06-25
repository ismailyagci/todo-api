export const DB_NAME = "todos";

export let TOKEN_SECRET_KEY = "api-layout";
export const createSecretToken = (key) => {
    TOKEN_SECRET_KEY = key;
};
