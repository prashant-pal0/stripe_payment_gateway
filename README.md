# Stripe Payment API with Prisma

## Project Setup

1. Clone the repository:

   ```bash

   git clone https://github.com/your-repo/stripe-payment-api.git

   cd stripe-payment-api
   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Set up the .env file with your Stripe API keys and PostgreSQL connection string:

   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key
   DATABASE_URL=postgres://user:password@localhost:5432/dbname
   ```

4. Migrate the database:

   ```npx prisma migrate dev --name init

   ```

5. Generate Prisma Client:

   ```npx prisma generate

   ```

6. Run the server:

   ```
    npm run start  for node app.js

    npm run start dev  for nodemon app.js

   ```

7. For API documentation

   ```
   http://localhost:3000/api-docs

   ```

## Project Screenshot

Screenshot of create payment API

![Project Screenshot](./image/createPayment.png)

Screenshot of get payment API

![Project Screenshot](./image/getAPI.png)
