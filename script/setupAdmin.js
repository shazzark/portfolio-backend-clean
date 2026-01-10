// script/setupAdmin.js

require('dotenv').config(); // Load .env
const mongoose = require('mongoose');
const User = require('../models/userModel');

async function setupAdmin() {
  try {
    // Use your MongoDB URI directly for now
    const mongoURI =
      'mongodb+srv://chidozinnam_db_user:Koleknnam081%2A@cluster0.xbv9nwd.mongodb.net/portfolio_website?retryWrites=true&w=majority';

    // CONNECT WITHOUT deprecated options
    await mongoose.connect(mongoURI);

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('ℹ️ Admin already exists:', existingAdmin.email);
      return;
    }
    // Create admin user
    const admin = await User.create({
      name: 'Chidozie Nnam',
      email: 'chidozinnam@gmail.com',
      bio: 'Fullstack developer delivering solutions aligned with latest trends',
      education: [
        {
          school: 'Your University',
          degree: 'Computer Science',
          startYear: 2020,
          endYear: 2024,
        },
      ], // Optional
      socialLinks: {
        github: 'https://github.com/shazzark',
        linkedin:
          'https://www.linkedin.com/in/chidozie-nnam-933375258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        twitter: 'https://x.com/DOZIEBUILDS',
      },
      role: 'admin',
    });

    console.log('✅ Admin created successfully:', admin.email);
  } catch (err) {
    console.error('❌ Admin setup failed:', err);
  } finally {
    // Disconnect from DB
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
setupAdmin();

// // scripts/setupAdmin.js
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const User = require('../models/userModel');

// dotenv.config({ path: '../config.env' });

// const setupAdmin = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);

//     const existingAdmin = await User.findOne({ role: 'admin' });

//     if (existingAdmin) {
//       console.log('✅ Admin already exists. Setup skipped.');
//       process.exit(0);
//     }

//     // Create admin with YOUR actual info
//     await User.create({
//       name: 'Chidozie Nnam',
//       email: 'chidozinnam@gmail.com',
//       bio: 'Fullstack developer delivering solutions aligned with latest trends',
//       education: [
//         {
//           school: 'Your University',
//           degree: 'Computer Science',
//           startYear: 2020,
//           endYear: 2024,
//         },
//       ],
//       socialLinks: {
//         github: 'https://github.com/shazzark',
//         linkedin:
//           'https://www.linkedin.com/in/chidozie-nnam-933375258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
//         twitter: 'https://x.com/DOZIEBUILDS',
//       },
//       role: 'admin',
//     });

//     console.log('✅ Admin created successfully');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Admin setup failed:', err);
//     process.exit(1);
//   }
// };

// setupAdmin();
