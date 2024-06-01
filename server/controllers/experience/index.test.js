const addressController = require( './index' );
const redis = require( '../../singletons/redis' );
const errors = require('../../utils/error-message');
const assert = require( 'assert' );
const { error } = require('console');
const exp = require('constants');

describe( 'address controller', () => {
  // Testing Address Addition
  it( 'lets us add an address', async () => {
    const addrId = await addressController.add({ line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' });

    const addr = await addressController.get( addrId );
    assert( addr.id.match( 'addr_' ), 'address should have had an ID' );
  });

  it( 'lets us test adding an address with an null city', async () => {
    try {
      await addressController.add({ line1: '185 Berry St', city: null, state: 'CA', zip: '94107' });
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });

  // FIXME: This test is would need to check the entry to be a valid city name but there is currently only type checking
  // Note: There should be a validation api to check if the api is a valid city name and actually exists in world
  // it( 'lets us test adding an address with an invalid city', async () => {
  //   try {
  //     await addressController.add({ line1: '185 Berry St', city: 'San Francisco 2', state: 'CA', zip: '94107' });
  //   } catch (e) {
  //     assert.strictEqual(e.message, errors.INVALID_CITY);
  //   }
  // });

  it( 'lets us test adding an address with an null state', async () => {
    try {
      await addressController.add({ line1: '185 Berry St', city: 'San Francisco', state: null, zip: '94107' });
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });

  //FIXME: Create a dictionary that contains all the valid state abbreviations and check if the state is valid
  // For example, this would be a valid addition if the backend had a dictionary of valid state abbreviations and converted it to shorthand
  it( 'lets us test adding an address with an invalid state', async () => {
    try {
      await addressController.add({ line1: '185 Berry St', city: 'San Francisco', state: 'California', zip: '94107' });
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });

  it( 'lets us test adding an address with a null zipcode', async () => {
    try {
      await addressController.add({ line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: null });
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });

  // FIXME: This test should be part of the data cleansing process and only store the first 5 digits of the zip code
  // Note: It should not fail the test but instead store the first 5 digits of the zip code
  it( 'lets us test adding an address with an invalid zip', async () => { 
    try {
      await addressController.add({ line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107-1234' });
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });

  //FIXME: This test might not be needed due to multiple people living in the same address
  // it( 'lets us test for duplicate entries', async () => {
  //   const addr = { line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' };
  //   await addressController.add( addr );

  //   try {
  //     await addressController.add( addr );
  //     assert.fail('Should have thrown an error');
  //   } catch (e) {
  //     assert.strictEqual(e.message, errors.VALIDATION_ERROR);
  //   }
  // });

  it( 'lets us test for empty address entries', async () => {
    try {
      await addressController.add({});
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });

  // Testing Address Update
  it( 'lets us update an address', async () => {
    const address = { line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' };
    const NEW_CITY = 'South San Francisco';
    const addrId = await addressController.add( address );

    await addressController.update( addrId, {
      ...address,
      id: addrId,
      city: NEW_CITY,
    });

    const addr = await addressController.get( addrId );
    assert.strictEqual( addr.city, NEW_CITY );
  });

  it( 'lets us test updating an address with a null fields', async () => {
    const address = { line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' };
    const NEW_CITY = '';
    const addrId = await addressController.add( address );

    try {
      await addressController.update( addrId, {
        ...address,
        id: addrId,
        city: NEW_CITY,
      });
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });
  
  //FIXME: Create a dictionary that contains all the valid state abbreviations and check if the state is valid
  // For example, this would be a valid addition if the backend had a dictionary of valid state abbreviations and converted it to shorthand
  it( 'lets us test invalid updates to state', async () => {
    const address = { line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' };
    const NEW_STATE = 'California';
    const addrId = await addressController.add( address );

    try {
      await addressController.update( addrId, {
        ...address,
        id: addrId,
        state: NEW_STATE,
      });
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });

  // FIXME: This test should be part of the data cleansing process and only store the first 5 digits of the zip code
  // Note: It should not fail the test but instead store the first 5 digits of the zip code
  it( 'lets us test invalid updates to zip', async () => {
    const address = { line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' };
    const NEW_ZIP = '94107-1234';
    const addrId = await addressController.add( address );

    try {
      await addressController.update( addrId, {
        ...address,
        id: addrId,
        zip: NEW_ZIP,
      });
      assert.fail('Should have thrown an error');
    } catch (e) {
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });

  // Testing Address Deletion
  it( 'lets us delete an address', async () => {
    const addrId = await addressController.add({ line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' });
    await addressController.delete( addrId );

    const addr = await addressController.get( addrId );
    assert( !addr );
  });

  it( 'lets us test for invalid deletion of addresses', async () => {
    const addrId = await addressController.add({ line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' });
    await addressController.delete( addrId );

    try {
      await addressController.delete( addrId );
      assert.fail('Should have thrown an error');
    } catch (e) { 
      assert.strictEqual(e.message, errors.VALIDATION_ERROR);
    }
  });    

  // Testing Address Retrieval
  it( 'lets us search through addresses', async () => {
    const addr1 = { line1: '185 Berry St', city: 'San Francisco', state: 'CA', zip: '94107' };
    const addr2 = { line1: '210 King St', line2: '#3', city: 'San Francisco', state: 'CA', zip: '94107' };

    addr1.id = await addressController.add( addr1 );
    addr2.id = await addressController.add( addr2 );

    assert.deepStrictEqual( await addressController.search( '185' ), [ addr1 ]);
    assert.deepStrictEqual( await addressController.search( '#3' ), [ addr2 ]);
    assert.deepStrictEqual( await addressController.search( addr1.id ), [ addr1 ]);
    assert.strictEqual( ( await addressController.search( 'CA' ) ).length, 2 );
    assert.strictEqual( ( await addressController.search() ).length, 2 );
  });

  it( 'lets us search through addresses with mismatched case', async () => {
    const addr1 = { line1: '185 berry st', city: 'SAN FRANCISCO', state: 'ca', zip: '94107' };
    const addr2 = { line1: '210 king St', line2: '#3', city: 'san francisco', state: 'CA', zip: '94107' };

    addr1.id = await addressController.add( addr1 );
    addr2.id = await addressController.add( addr2 );

    assert.deepStrictEqual( await addressController.search( '185' ), [ addr1 ]);
    assert.deepStrictEqual( await addressController.search( '#3' ), [ addr2 ]);
    assert.deepStrictEqual( await addressController.search( addr1.id ), [ addr1 ]);
    assert.strictEqual( ( await addressController.search( 'CA' ) ).length, 2 );
    assert.strictEqual( ( await addressController.search() ).length, 2 );
  });

  afterEach( async () => {
    await redis.flushall();
  });
});
