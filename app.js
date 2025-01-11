require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Express app setup
const app = express();
const PORT = process.env.PORT || 3000;

// Supabase configuration
const supabaseUrl = 'https://zyldhfgomockanyaptwi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;


// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Validate Supabase configuration
if (!supabaseKey) {
  console.error('SUPABASE_KEY is not defined in environment variables');
  process.exit(1);
}

// API Routes
app.get('/clothing', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clothingid')
      .select('*');

    if (error) throw error;
    console.log('Clothing Data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching clothing items:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch clothing items'
    });
  }
});


app.get('/allclothesnew', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('allclothes')
      .select(`
        AllClothesID:ID,
        IsNew,
        IsAtSale,
        ClothingID (
          ID,
          Name,
          Photo,
          Price,
          Color,
          Size
        ),
        ShoesID (
          ID,
          Name,
          Photo,
          Price,
          Color,
          Size
        ),
        BagsID (
          ID,
          Name,
          Photo,
          Price,
          Color,
          Size
        ),
        AccessoriesID (
          ID,
          Name,
          Photo,
          Price,
          Color,
          Size
        )
      `)
      .eq('IsNew', true);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching all clothes:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch all clothes data'
    });
  }
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});