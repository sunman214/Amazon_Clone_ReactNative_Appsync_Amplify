const stripe = require('stripe')('sk_test_26PHem9AhJZvU623DfE1x4sd');

exports.handler = async event => {
  const {typeName, arguments} = event;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: arguments.amount,
    currency: 'usd'
  });
  return {
    clientSecret: paymentIntent.client_secret
  };
};
