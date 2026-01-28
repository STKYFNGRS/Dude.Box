// Quick test script to directly query Stripe API
const Stripe = require('stripe');

// You need to pass your secret key as an environment variable
const secretKey = process.argv[2] || process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.error('❌ Please provide Stripe secret key as argument');
  console.error('Usage: node test-stripe-api.js sk_test_...');
  process.exit(1);
}

const stripe = new Stripe(secretKey);

async function testSubscription() {
  try {
    // Get the most recent subscription
    const subscriptions = await stripe.subscriptions.list({
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      console.log('❌ No subscriptions found');
      return;
    }

    const sub = subscriptions.data[0];
    
    console.log('\n📋 Subscription from Stripe API:');
    console.log(`   ID: ${sub.id}`);
    console.log(`   Status: ${sub.status}`);
    console.log(`   cancel_at_period_end: ${sub.cancel_at_period_end}`);
    console.log(`   cancel_at: ${sub.cancel_at}`);
    console.log(`   canceled_at: ${sub.canceled_at}`);
    console.log(`   current_period_end: ${new Date(sub.current_period_end * 1000)}`);
    
    console.log('\n✅ Direct API query complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSubscription();
