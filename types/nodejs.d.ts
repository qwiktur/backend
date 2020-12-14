declare namespace NodeJS {

    export interface ProcessEnv {
        API_PORT: string;
        DB_URL: string;
        ACCESS_TOKEN_SECRET: string;
        ACCESS_TOKEN_EXPIRATION: string;
    }
}
