import _ from 'lodash';

function component() {
    const element= document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component());

function Square(props) {return <h1>This is still jsx</h1>};