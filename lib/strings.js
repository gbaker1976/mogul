module.exports = {
    desanitize: function( str ){
        return str.replace( '\\\\', /\\/g ).
            replace( '\\b', /\u0008/g ).
            replace( '\\t', /\t/g ).
            replace( '\\n', /\n/g ).
            replace( '\\f', /\f/g ).
            replace( '\\r', /\r/g ).
            replace( '\\\'', /'/g ).
            replace( '\\"', /"/g );
    },

    sanitize: function( str ){
        return str.replace( /\\/g, '\\\\' ).
            replace( /\u0008/g, '\\b' ).
            replace( /\t/g, '\\t' ).
            replace( /\n/g, '\\n' ).
            replace( /\f/g, '\\f' ).
            replace( /\r/g, '\\r' ).
            replace( /'/g, '\\\'' ).
            replace( /"/g, '\\"' );
    }
};
