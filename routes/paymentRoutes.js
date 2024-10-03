import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
const router = Router();

// Payment endpoints


/**
 * @swagger
 * /api/payment/create:
 *   post:
 *     summary: Create a new payment
 *     description: Create a payment intent using Stripe and store the payment details in PostgreSQL.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Amount to be charged (in cents).
 *               currency:
 *                 type: string
 *                 description: Currency code (e.g., 'usd').
 *               source:
 *                 type: string
 *                 description: Stripe token representing the payment source (e.g., a card).
 *               description:
 *                 type: string
 *                 description: Description of the payment.
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 payment:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Payment failed
 */
router.post('/payment/create', paymentController.createPayment);


/**
 * @swagger
 * /api/payment/{id}:
 *   get:
 *     summary: Get payment details
 *     description: Retrieve payment details from PostgreSQL using the payment ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to retrieve.
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentId:
 *                   type: string
 *                 amount:
 *                   type: integer
 *                 currency:
 *                   type: string
 *                 status:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Error retrieving payment
 */
router.get('/payment/:id', paymentController.getPayment);

export default router;
