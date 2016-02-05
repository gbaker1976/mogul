var memjs = require( 'memjs' );
var client;

client = memjs.Client.create( process.env.MEMCACHEDCLOUD_SERVERS, {
    username: process.env.MEMCACHEDCLOUD_USERNAME,
    password: process.env.MEMCACHEDCLOUD_PASSWORD
});

var Cache = function(){};

Cache.prototype.set = function( key, value, callback ){
    client.set( key, value, callback );
};

Cache.prototype.get = function( key, callback ){
    client.get( key, callback );
};

module.exports = new Cache();
