const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/booklibrary', { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('MongoDB connected successfully.');

    const adminEmail = 'admin@bookstore.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Replacing existing double-hashed demo admin account...');
      await User.deleteOne({ email: adminEmail });
    }

    // Do NOT hash manually, User model pre('save') hook handles it!
    const adminUser = new User({
      name: 'System Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
      isActive: true,
      phoneNumber: '0000000000',
      address: 'AdminHQ'
    });

    await adminUser.save();
    console.log('✅ Demo Admin user created successfully!');
    console.log('Email: admin@bookstore.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
