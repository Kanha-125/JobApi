require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authRouter = require("./routes/auth")
const jobsRouter = require("./routes/jobs")
const connectDb = require("./db/connect")
const authMiddleware = require("./middleware/authentication")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter());


// extra packages

// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authMiddleware, jobsRouter)

app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
