define(['mogul'], function (_mogul) {
    'use strict';

    var view = new _mogul.Mogul.View({
        template: 'Hello!',
        node: document.querySelector('body')
    });

    view.render();
});