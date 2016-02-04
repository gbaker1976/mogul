function findAlias( alias, aliases ){
    var i = aliases.length;

    while ( i-- ) {
        if ( aliases[ i ] === alias ) {
            return true;
        }
    }

    return false;
}

module.exports = function(){
    return {
        findItemByAlias: function( alias, collection ){
            var i = collection.length;
            var item;

            while ( i-- ) {
                item = collection[ i ];
                if ( findAlias( alias, item.aliases ) ) {
                    return item;
                }
            }
        }
    };
}();
