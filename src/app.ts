import database from './database';
import expressConfig from './express-config';
import dotenv from 'dotenv';
import themeRouter from './routes/themeRoute';
import userRouter from './routes/userRoute';
import questionRouter from './routes/questionRoute';
import gameRouter from './routes/gameRoute';
import imageRouter from './routes/imageRoute';
import authRouter from './routes/authRoute';

(async function() {
    try {
        // .env configuration
        dotenv.config();

        // Database connection
        await database.connect(process.env.DB_URL);
        console.log(`Connected to database "${process.env.DB_URL}"`);

        // Express configuration
        const app = expressConfig();
        app.use('/auth', authRouter);
        app.use('/themes', themeRouter);
        app.use('/users', userRouter);
        app.use('/questions', questionRouter);
        app.use('/games', gameRouter);
        app.use('/images', imageRouter);

        // Handler used when no endpoint matches
        app.all('*', (req, res) => {
            return res.status(404).json({ error: `Unknown endpoint ${req.method} ${req.originalUrl}` });
        });

        app.listen(process.env.API_PORT as unknown as number);
        console.log(`Server listening on port ${process.env.API_PORT}`);
    } catch (err) {
        console.error(err);
    }
})();
