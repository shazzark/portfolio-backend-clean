const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Certificate = require('../models/certificateModel');
dotenv.config({ path: './config.env' });

const certificates = [
  {
    title: 'React, Next.js, Redux, Context API, React Query & Tailwind CSS',
    platform: 'Udemy',
    certificateUrl:
      'https://www.udemy.com/certificate/UC-efeb4c7d-14e4-42ee-909b-700eb235f18b/',
  },
  {
    title: 'Node.js, Express.js & MongoDB',
    platform: 'Udemy',
    certificateUrl:
      'https://www.udemy.com/certificate/UC-33edd0d0-2305-4cb3-84fa-76e1b768207e/',
  },
  {
    title: 'HTML & CSS',
    platform: 'Udemy',
    certificateUrl:
      'https://www.udemy.com/certificate/UC-9bf050d6-25f8-4b76-9ea8-54174b684f41/',
  },
  {
    title: 'JavaScript',
    platform: 'Udemy',
    certificateUrl:
      'https://www.udemy.com/certificate/UC-05b9a47d-78ea-4f7f-bc59-043c58f035a0/',
  },
];

mongoose
  .connect(
    process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD),
  )
  .then(() =>
    Certificate.bulkWrite(
      certificates.map((certificate) => ({
        updateOne: {
          filter: { certificateUrl: certificate.certificateUrl },
          update: { $set: certificate },
          upsert: true,
        },
      })),
    ),
  )
  .then(() => mongoose.disconnect());
