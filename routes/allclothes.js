const express = require('express');
const router = express.Router();
const supabase = require('../db/supabaseClient.js');


router.get('/clothing', async (req, res) => {
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
  
  
  router.get('/allclothesnew', async (req, res) => {
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

  module.exports = router;