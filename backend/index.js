const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data/data');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>API is running</h1>");
});
// app.get("/api/chat", (req, res) => {
//     res.send(chats);
// });
// app.get("/api/chat/:id", (req, res) => {
//     const singleChat = chats.find((c) => c._id === req.params.id);
//     res.send(singleChat);
// });
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
