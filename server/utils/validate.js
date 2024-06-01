const Ajv = require( 'ajv' );
const errors = require( '../utils/error-message')

module.exports = ( schema, data ) => {
  const ajv = new Ajv();
  const validate = ajv.compile( schema );
  const ok = validate( data );

  if ( !ok ) {
    throw new Error(errors.VALIDATION_ERROR);
  }
};
