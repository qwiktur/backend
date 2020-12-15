import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mung from 'express-mung';

const expressConfig = (): express.Application => {
    const app = express();

    // Security
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(helmet());
    app.use(cors());

    // Logging request and response
    app.use(mung.json((body, req) => {
        console.log(`${req.ip} > Requested ${req.method} ${req.originalUrl}`);
    }, { mungError: true }));

    return app;
}

export default expressConfig;
