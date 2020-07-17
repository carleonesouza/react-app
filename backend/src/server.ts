import express from 'express';
import cors from 'cors';
import path from 'path';
import router from './routes/routes'


const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333, 'localhost', () => {
    console.log('Server is Runnng at port 3333');
});