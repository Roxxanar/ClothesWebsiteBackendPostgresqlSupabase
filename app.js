require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Express app setup
const app = express();
const PORT = process.env.PORT || 3200;

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


app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('E-mail', email);

    if (checkError) throw checkError;
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ 'E-mail': email, 'Password': password }]);

    if (insertError) throw insertError;

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/login', async (req, res) => {

  const email = req.body.email?.trim();
const password = req.body.password?.trim();

  console.log('Trying to login with:', email, password);
  

  try {
    // Check if user exists with correct password
    const { data: users, error } = await supabase
    .from('users')
    .select('"E-mail", "Password", "First Name"')
    .eq('E-mail', email)
    .eq('Password', password);


       console.log('Query result:', users);

    if (error) throw error;

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Simulated token (you can replace with JWT if needed)
    const token = 123;


    res.status(200).json({
      message: 'Login successful',
      token,
      username: user['First Name'] || email // default fallback
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/usersubscribed', async (req, res) => {
  const email = req.body.email?.trim();
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // 1. Check if the user exists
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('E-mail', email);

    if (fetchError) throw fetchError;

    if (users.length > 0) {
      const user = users[0];

      // 2. If already subscribed
      if (user.IsSubscribed === true || user.IsSubscribed === 1) {
        return res.status(200).json({ message: 'You are already subscribed' });
      }

      // 3. User exists but not subscribed
      const { error: updateError } = await supabase
        .from('users')
        .update({ IsSubscribed: true })
        .eq('E-mail', email);

      if (updateError) throw updateError;

      return res.status(200).json({ message: 'You are now subscribed' });

    } else {
      // 4. User does not exist, insert new
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ 'E-mail': email, IsSubscribed: true }]);

      if (insertError) throw insertError;

      return res.status(201).json({ message: 'User subscribed successfully' });
    }

  } catch (error) {
    console.error('Subscription error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
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