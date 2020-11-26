import expressConfig from './express-config';
import dotenv from 'dotenv';
import themeRouter from '../src/routes/themeRoute'
import userRouter from '../src/routes/userRoute'
dotenv.config();
const app = expressConfig();

// TODO Register routers here with app.use()
app.use(themeRouter)
app.use(userRouter)
// Handler used when no endpoint matches
app.all('*', (req, res) => {
    return res.status(404).json({ error: `Unknown endpoint ${req.method} ${req.originalUrl}` });
});

app.listen(80);
