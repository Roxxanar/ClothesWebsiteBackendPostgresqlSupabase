const express = require('express');
const router = express.Router();
const supabase = require('../db/supabaseClient');

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: existingUsers, error: checkError } = await supabase
      .from('users').select('*').eq('E-mail', email);

    if (checkError) throw checkError;
    if (existingUsers.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const { error: insertError } = await supabase
      .from('users').insert([{ 'E-mail': email, 'Password': password }]);

    if (insertError) throw insertError;
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('"E-mail", "Password", "First Name"')
      .eq('E-mail', email)
      .eq('Password', password);

    if (error) throw error;
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const token = 123; // simulate token

    res.status(200).json({
      message: 'Login successful',
      token,
      username: user['First Name'] || email
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Google auth
router.post('/google', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('ID, E-mail, "First Name", "Last Name", IsSubscribed')
      .eq('E-mail', email);

    if (fetchError) throw fetchError;

    if (existingUsers.length > 0) {
      return res.status(200).json({ message: 'User already exists', user: existingUsers[0] });
    }

    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ 'E-mail': email }]);

    if (insertError) throw insertError;

    return res.status(201).json({ message: 'User created successfully', user: data[0] });

  } catch (error) {
    console.error('Google auth error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
