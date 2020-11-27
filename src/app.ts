import database from './database';
import expressConfig from './express-config';
import dotenv from 'dotenv';
import themeRouter from './routes/themeRoute'
import userRouter from './routes/userRoute'
import questionRouter from './routes/questionRoute'
import gameRouter from './routes/gameRoute'
import imageRouter from './routes/imageRoute'
dotenv.config();
const app = expressConfig();

(async function() {
    try {
        // .env configuration
        dotenv.config();

        // Database connection
        await database.connect(process.env.DB_URL);
        console.log(`Connected to database "${process.env.DB_URL}"`);

        // TODO Register routers here with app.use()
        app.use(themeRouter)
        app.use(userRouter)
        app.use(questionRouter)
        app.use(gameRouter)
        app.use(imageRouter)
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
