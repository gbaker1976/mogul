import { Mogul } from "mogul";

let view = new Mogul.View({
    template: 'Hello!',
    node: document.querySelector( 'body' )
});

view.render();
