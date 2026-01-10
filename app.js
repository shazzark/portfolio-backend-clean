const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const skillRouter = require('./routes/skillsRoutes');
const experienceRouter = require('./routes/experienceRoutes');
// const educationRouter = require('./routes/educationRoutes');
// const contactRouter = require('./routes/contactRoutes');
// const blogRouter = require('./routes/blogRoutes');
const projectRouter = require('./routes/projectRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://172.23.192.1:3002'],
    credentials: true,
  }),
);

app.use(cookieParser());

// SET SECURITY HTTP HEADERS
app.use(helmet());

app.use(
  '/img',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // key for images
    next();
  },
  express.static(path.join(__dirname, 'img')),
);

// app.use('/img', express.static(path.join(__dirname, 'public/img')));
// GLOBAL MIDDLEWARE

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// for development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
// listen to request from api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from this IP, try again later',
});

app.use('/api', limiter);

// body parser , reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// data sanitization against  nosql query injection
// app.use(mongoSanitize());

// data sanitisation against xss
// app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'ratingAverage',
      'bedrooms',
      'bathrooms',
      'area',
      'yearBuilt',
      'ratingQuantity',

      // GEOGRAPHIC FIELDS
      'coordinates',
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/img', express.static(path.join(__dirname, 'public/img')));

// ROUTES

// Routes
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/skills', skillRouter);
app.use('/api/v1/experience', experienceRouter);
// app.use('/api/v1/education', educationRouter);
// app.use('/api/v1/contact', contactRouter);
// app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/users', userRouter);

// app.all('/*', (req, res, next) => {
//   next(new AppError(`cant find ${req.originalUrl} on this server`));
// });

// app.use(globalErrorHandler);
app.use((req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
