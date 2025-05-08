// Error handling middleware
module.exports = (err, req, res, next) => {
    console.error('Global Error:', err.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  };
  