const express = require( 'express' );
const addressRoutes = require( './routes/address-routes' );
const app = express();

app.use( express.json() );

app.get( '/', ( req, res ) => {
  res.send({ greeting: 'Hello world!' });
});

app.use('/api/addresses', addressRoutes);

app.listen( process.env.PORT );
