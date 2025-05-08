require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');


// Express app setup
const app = express();
const PORT = process.env.PORT || 3200;


// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());


const authRoutes = require('./routes/auth');
const allClothesRoutes = require('./routes/allclothes');
const subscriptionRoutes = require('./routes/subscribe');
const errorHandler = require('./middleware/errorHandler');



// API routes
app.use('/auth', authRoutes);
app.use('/clothing', allClothesRoutes);
app.use('/subscription', subscriptionRoutes);

// Error handling
app.use(errorHandler);



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});