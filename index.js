import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan';
import path from 'path'
import { fileURLToPath } from 'url';

/* Routes */
import postRoutes from './Routes/posts.js';
import authRoutes from './Routes/auth.js';
import userRoutes from './Routes/users.js';
import { verifyToken } from './middleware/auth.js';
import { createPost, checkExpiry } from './Controllers/postController.js'
import { register } from './Controllers/auth.js'

/* CONFIG */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors({origin: '*'}));
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, req.body.picturePath);
    },
  });
const upload = multer({ storage });


/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post('/posts', verifyToken, upload.single("picture"), createPost)

/* ROUTES */
app.use('/posts', postRoutes);
app.use('/auth', authRoutes)
app.use('/users', userRoutes )

/* CONNECTION */
const CONNECTION_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3001;
mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server started ! \nServer is running on port http://localhost:${PORT}/`))

})
.catch((error)=> console.log(`${error} did not connect`))
app.get('/', (req, res) => (res.send("Server Backend is running")));

setInterval(function () {
  checkExpiry();
}, 300000 );