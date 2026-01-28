import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import pastesRouter from './routes/pastes';
import healthzRouter from './routes/healthz';

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/pastes', pastesRouter);
app.use('/api/healthz', healthzRouter);

const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Not Found' });
        return;
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
