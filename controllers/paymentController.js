import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Ensure Stripe secret key is set
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key not set in environment variables");
}

// const createSource = async () => {
//   const customerSource = await stripe.customers.createSource(
//     "cus_QxRATLYNaaf5Gn",
//     {
//       source: "tok_mastercard",
//     }
//   );
//   return customerSource.id;
// };

const paymentMethod = async (source) => {
  // const source = await createSource();
  const method = await stripe.paymentMethods.create({
    type: "card",
    card: { token: source},
  });
  return method.id;
};

// const createToken = async () => {
//   let token = {};
//   try {
//       token = await stripe.tokens.create({
//           card: {
//               number: '4242424242424242',
//               exp_month: 12,
//               exp_year: 2024,
//               cvc: '123'
//           }
//       });
//   } catch (error) {
//       switch (error.type) {
//           case 'StripeCardError':
//               token.error = error.message;
//               break;
//           default:
//               token.error = error.message;
//               break;
//       }
//   }

//   console.log("jdfkwcwedckew1234",token)
//   return token;
// }

// createToken()

// const createSource = async () => {
//   try {
//     const source = await stripe.sources.create({
//       type: 'card',
//       currency: 'usd',
//       owner: {
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//       },
//       card: card ,
//     });

//     console.log('Source created:', source.id);
//     return source.id;
//   } catch (error) {
//     console.error('Error creating source:', error);
//   }
// };

// createSource();

// Create payment
const createPayment = async (req, res) => {
  try {
    const { amount, currency, source, description } = req.body;

    if (!amount || !currency || !source) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const paymentMethods = await paymentMethod(source);

    // Create a payment intent using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount)*100,
      currency,
      payment_method: paymentMethods,
      payment_method_types: ['card'],
      return_url: 'http://localhost:3000/api/payment/paymentIntent.id', // Add your return URL here
      description,
      confirm: true,
    });

    // Save payment details in the database using Prisma
    const payment = await prisma.payment.create({
      data: {
        paymentId: paymentIntent.id,
        amount,
        currency,
        status: paymentIntent.status,
        description,
      },
    });

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Payment failed" });
  }
};

// Retrieve payment details
const getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the payment from the database using Prisma
    const payment = await prisma.payment.findUnique({
      where: { paymentId: id },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving payment" });
  }
};

// Default export
export default {
  createPayment,
  getPayment,
};
