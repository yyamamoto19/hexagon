const experienceSchema = require( './experience.schema.json' );
const validate = require( '../../utils/validate' );
const { serialize, deserialize } = require( '../../utils/message-pack' );
const uuid = require( 'uuid' ).v4;

const redis = require( '../../singletons/redis' );
const EXPERIENCES = 'experience';

// eslint-disable-next-line
const log = console.log;

module.exports = {
  async add( experience ) {
    const id = 'exper_' + uuid();

    log( 'creating', id );

    const withId = {
      ...experience,
      id,
    };

    validate( experienceSchema, withId );

    await redis.HSET( EXPERIENCES, withId.id, serialize( withId ) );

    return id;
  },

  async update( id, newData ) {
    log( 'updating', id );

    validate( experienceSchema, newData );

    await redis.HSET( EXPERIENCES, id, serialize( newData ) );
  },

  async delete( id ) {
    log( 'deleting', id );

    await redis.HDEL( EXPERIENCES, id );
  },

  async get( id ) {
    log( 'getting', id );

    const res = await redis.HGET( EXPERIENCES, id );
    if ( !res ) return;
    return deserialize( res );
  },

  async search( searchString = '' ) {
    log( 'searching', searchString );

    // Why won't this work in production?

    const experiences = await redis.HGETALL( EXPERIENCES );

    if(!experiences) return [];

    return Object.values( experiences )
      .map( ( buffer ) => deserialize( buffer ) )
      // turn the addresses into a flat string
      .filter( ( experience ) => {
        const searchable = Object.values( experience ).join( ' ' ).toLowerCase();
        return searchable.includes( searchString.toLowerCase() );
      });
  },
};
