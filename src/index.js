import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
//  https://www.npmjs.com/package/react-full-screen
// window.document.documentElement.requestFullscreen();

// function toggleFullScreen() {
// var doc = window.document;
// var docEl = doc.documentElement;
//
// var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
// var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
//
// if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
//   requestFullScreen.call(docEl);
// }
// else {
//   cancelFullScreen.call(doc);
// }
// }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
