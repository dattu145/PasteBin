import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import pastesRouter from './routes/pastes';
import healthzRouter from './routes/healthz';

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors()); // Allow all origins for dev
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/pastes', pastesRouter);
app.use('/api/healthz', healthzRouter);

// Serve static files from the React frontend app
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Handle React routing, return all requests to React app
app.use((req, res) => {
    // Only serve index.html if it exists, otherwise 404 for API calls that missed
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Not Found' });
        return;
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
