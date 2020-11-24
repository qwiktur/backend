import expressConfig from './express-config';

const app = expressConfig();

// TODO Register routers here with app.use()

// Handler used when no endpoint matches
app.all('*', (req, res) => {
    return res.status(404).json({ error: `Unknown endpoint ${req.method} ${req.originalUrl}` });
});

app.listen(80);
