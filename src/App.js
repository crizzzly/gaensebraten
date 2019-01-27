import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MyProvider, MyContext } from "./context";

import "./App.css";
import Login from "./Login";
import Receipts from "./Receipts";
import Leap from 'leapjs';
import ScreenPosition from 'leapjs-plugins'
import {HandSwipe, HandHold} from 'leapjs-gesture'
import  'pepjs'
// import './lib/leapcursor-with-dependencies.min.js?gestureColor=#4268f4"'
// import LeapCursor from './lib/leapcursor.js?gestureColor=#4286f4'
// import Fullscreen from "react-full-screen";



class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      frame: {},
      active: null,
      currentTime: this.getTimeString(),
      selected_div: null,
      leapPointerCol: '#15a9b4',
      leapPointerSize: '20px',
      deck_bg: 'white',
      leapPointer: {
        x: -10,
        y: -10,
        z: -10
      },

      alert: {
        show: false,
        msg: ""
      }
    };
    // this.handleSelectedDataChange = this.handleSelectedDataChange.bind(this)
    this.first = true
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.onFrame = this.onFrame.bind(this)
  }

  getChildContext(){
    return {
      leapContextFrame: this.state.frame
    }
  }
  getTimeString() {
    const date = new Date(Date.now()).toLocaleTimeString();
    return date;
  }
  componentDidMount() {
    const {options} = this.props
    this.setupLeap(options)
    this.leapController.connect()
    console.log('LeapProvider - componentDidMount')
    setInterval(() => {
      this.timer = this.setState({
        currentTime: this.getTimeString()
      })
    },1000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
}
  componentWillUnmount(){
    this.leapController.disconnect()
  }

  setupLeap(options){
    this.leapController = new Leap.Controller({
      enableGestures: true
    })

    this.leapController.on('deviceAttached', function() {
      console.log('LeapProvider - deviceAttached');
    });
    this.leapController.on('deviceStreaming', function() {
      console.log('LeapProvider - deviceStreaming');
    });
    this.leapController.on('deviceStopped', function() {
      console.log('LeapProvider - deviceStopped');
    });
    this.leapController.on('deviceRemoved', function() {
      console.log('LeapProvider - deviceRemoved');
    });
    this.leapController.on('deviceRemoved', function() {
      console.log('LeapProvider - deviceRemoved');
    });
    this.leapController.on('frame', this.onFrame);

    this.leapController.on('gesture', this.onGesture)

    this.leapController.use('screenPosition');
    this.leapController.use('handSwipe');
    this.leapController.use('handHold')

    this.leapController.on('handSwipe', this.handleSwipe)
  }

  onFrame(frame){
    this.setState({frame})
    this.readData(frame)
  }

  start(){
    console.log('start')
    localStorage.setItem('Leap', JSON.stringify(this.state.frame))
    this.first = false
  }

  stop(){
    console.log('stop')
    cancelAnimationFrame(this.frameId)
  }

  animate(){
    console.log('animate')
    this.setState({
      frame: this.leapController.frame()
    })
    this.frameId = window.requestAnimationFrame(this.animate)
  }


  onGesture(gesture, frame){
    console.log(gesture.type + " with ID " + gesture.id + " in frame " + frame.id);

    switch (gesture.type){
      case "keyTap":
        var hand= frame.hand(gesture.handIds);
        console.log('hand: '+hand)
        this.leapPointer = hand.screenPosition()
        var el = document.elementFromPoint(this.leapPointer[0], this.leapPointer[1])
        console.log(el)
        // this.setState({})
    }
  }
  handleSwipe(hand){
    console.log('handSwipe! ' + hand.swipeDirection + ' id: ', hand.id)
  }

  fakePointerEvent(id, pointerType, eventType, x, y, p) {
  /* further defaults */
  var tx = 0, ty = 0, w = 50, h = 50;
  if('PointerEvent' in window) {
    /* construct pointer event */
    var e = new PointerEvent(eventType, {
      pointerId: id,
      width: w,
      height: h,
      pressure: p,
      tiltX: tx,
      tiltY: ty,
      pointerType: pointerType,
      isPrimary: false,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y
    });
    /* dispatch constructed event to whatever element is at the coordinates (no support for pointer capture at this stage) */
    var el = document.elementFromPoint(x, y)
    if (el){
        el.dispatchEvent(e);
    }
  }
}

  // functions to set the circle position according to finger tip position detected by leap
  mapVal(val, in_min, in_max, out_min, out_max) {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  getFingerScreenPosition(leapPosition, spaceSize=50) {
    const INTERACTION_SPACE_WIDTH = 200
    const INTERACTION_SPACE_DEPTH = 120

    const max_width = 2* INTERACTION_SPACE_WIDTH
    const max_depth = 2* INTERACTION_SPACE_DEPTH

    const x = this.mapVal(leapPosition[0], -INTERACTION_SPACE_WIDTH, INTERACTION_SPACE_WIDTH, 0, window.innerWidth)
    const y = this.mapVal(leapPosition[2], -INTERACTION_SPACE_DEPTH, INTERACTION_SPACE_DEPTH, 0, window.innerHeight)
    const z = this.mapVal(leapPosition[2], -INTERACTION_SPACE_WIDTH, INTERACTION_SPACE_WIDTH, 0, window.innerWidth)

    const pos = [x, y, z]
    return pos
  }

  readData(frame){
    this.hands = frame.hands
    this.leapPointer = [-10, -10, 0];
    if (this.hands && this.hands.length){
      this.hands.forEach((hand, index) => {
        this.leapPointer = hand.screenPosition()

        // if (hand.type === "left") {
        //   this.leftIndex = this.getFingerScreenPosition(hand.thumb.dipPosition);
        //   this.leftThumb =  this.getFingerScreenPosition(hand.indexFinger.dipPosition );
        //   console.log("left hand: " + this.leftIndex + ", " + this.leftThumb);
        // } else {
        //   this.leapPointer = this.getFingerScreenPosition(hand.thumb.dipPosition);
        //   this.rightThumb = this.getFingerScreenPosition(hand.indexFinger.dipPosition);
        //   console.log("right hand: " + this.leapPointer + ", " + this.rightThumb);
        // }
        var x = window.innerWidth * frame.interactionBox.normalizePoint(this.leapPointer, true)[0];
        var y = window.innerHeight * (1 - frame.interactionBox.normalizePoint(this.leapPointer, true)[1]);
        var id = hand.id
        var p = hand.pinchStrength

        if (p > .5){
          var el = document.elementFromPoint(this.leapPointer[0], this.leapPointer[1])
          this.setState({leapPointerCol: '#11858e'})
          this.setState({leapPointerSize: '25px'})
          this.fakePointerEvent(id, 'leap', 'pointermove', x, y, .5)
          console.log('parent '+ el.parentNode)
          console.log('class '+ el.constructor.toString())
          // this.setState({active: el})
          console.log(el)
        } else{
          this.setState({leapPointerSize: '20px'})
          this.setState({leapPointerCol: '#15a9b4'})
          this.fakePointerEvent(id, 'leap', 'pointermove', x, y, p)
        }


      })

    }
    this.setState({leapPointer: {
      x: this.leapPointer[0],
      y: this.leapPointer[1],
      z: this.leapPointer[2]}
    })
  }
  notification = (type, msg) => {
    this.setState({ alert: { type: type, show: true, msg: msg } });
    setTimeout(() => {
      this.setState({ alert: { show: false } });
    }, 5000);
  }
  acceptRecipe = receipt => {
    this.setState({ active: receipt });
  };
  handleMenu = event => {
    event.preventDefault();
    this.setState({ menu: !this.state.menu });
  };

  render() {
    return (
      <div className="App h-100">
        <MyProvider>
          <Router>
            <div className="position-relative h-100 d-flex flex-column">
              <header className="App-header bg-info">
                <nav className="navbar row">
                  <div className="col-md-4">
                    <div className="menu " onClick={this.handleMenu}>
                      J.O.
                      <div
                        className={`bg-white menumenu${
                          this.state.menu ? "" : " hidden"
                          }`}
                      >
                        <ul>
                          <li />
                          <Link to="/">Abmelden</Link>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <MyContext.Consumer>
                    {context => (
                      <div className="text-center text-white col-md-4">
                        <strong>Uhrzeit: </strong>{this.state.currentTime} | <strong>Kochzeit:</strong> {context.time} m
                        </div>
                    )}
                  </MyContext.Consumer>
                  <div className="col-md-4 text-right">
                  {/* {button} */}
                  </div>
                </nav>

                <div
                  className={`alert ${
                    this.state.alert.show === true ? "" : " hidden"
                    } alert-${this.state.alert.type}`}
                >
                  {this.state.alert.msg}
                </div>
              </header>
              <div className="h-100 flex-grow-1 position-relative">
                <Route path="/" exact component={Login} />
                {/* <Route
                  path="/recipe/:recipe"
                  exact
                  render={props => (
                    <Receipt {...props} active={this.state.active} />
                  )}
                /> */}
                <Route
                  path="/receipts"
                  exact
                  render={props => (
                    <Receipts
                      {...props}
                      active={this.state.active}
                      notification={this.notification}
                      acceptRecipe={this.acceptRecipe}
                    />
                  )}
                />
              </div>
            </div>
          </Router>
          {/* <div
            className="leap_pointer"
            style={{
              left:this.state.leapPointer.x,
              top:this.state.leapPointer.y,
              background:this.state.leapPointerCol,
              width:this.state.leapPointerSize,
              height:this.state.leapPointerSize
            }}
            /> */}
        </MyProvider>
      </div>
    ); // end of return
  }
}

export default App;
