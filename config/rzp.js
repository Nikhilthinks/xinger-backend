const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  
    // Replace with your key_id
    key_id: 'rzp_test_1npt9lzEgKUu4Z',
  
    // Replace with your key_secret
    key_secret: '4NjmGaPcgR6OJUjEEVrWIsno'
});

module.exports = razorpayInstance;