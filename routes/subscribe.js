const express = require('express');
const router = express.Router();
const supabase = require('../db/supabaseClient');


router.post('/usersubscribed', async (req, res) => {
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
  


module.exports = router;