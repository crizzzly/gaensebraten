import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MyProvider, MyContext } from "./context";

import "./App.css";
import Login from "./Login";
import Receipt from "./Receipt";
import Receipts from "./Receipts";
import Leap from 'leapjs';


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      frame: {},
      active: null,
      rightThumb: {
        x: -10,
        y: -10,
        z: -10
      },
      rightIndex: {
        x: -10,
        y: -10,
        z: -10
      },
      leftThumb: {
        x: -10,
        y: -10,
        z: -10
      },
      leftIndex: {
        x: -10,
        y: -10
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

  componentDidMount() {
    const {options} = this.props
    this.setupLeap(options)
    this.leapController.connect()
    console.log('LeapProvider - componentDidMount')
  }

  componentWillUnmount(){
    this.leapController.disconnect()
  }

  setupLeap(options){
    this.leapController = new Leap.Controller(options)

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

  readData(frame){
    this.hands = frame.hands
    this.leftThumb = [-10, -10];
    this.leftIndex = [-10, -10];
    this.rightThumb = [-10, -10];
    this.rightIndex = [-10, -10];
    if (this.hands && this.hands.length){
      this.hands.forEach((hand, index) => {
        if (hand.type === "left") {
          this.leftIndex = this.getFingerScreenPosition(hand.thumb.dipPosition);
          this.leftThumb =  this.getFingerScreenPosition(hand.indexFinger.dipPosition );
          console.log("left hand: " + this.leftIndex + ", " + this.leftThumb);
        } else {
          this.rightIndex = this.getFingerScreenPosition(hand.thumb.dipPosition);
          this.rightThumb = this.getFingerScreenPosition(hand.indexFinger.dipPosition);
          console.log("right hand: " + this.rightIndex + ", " + this.rightThumb);
        }
      })

    }
    // else{
    //   console.log("no hands")
    // }
    this.setState({leftIndex: {
      x: this.leftIndex[0],
      y: this.leftIndex[1]
    }})
    this.setState({rightIndex: {x: this.rightIndex[0], y: this.rightIndex[1], z: this.rightIndex[2]}})
    this.setState({leftIndex:  {x: this.leftIndex[0],  y: this.leftIndex[1],  z: this.leftIndex[2] }})
    this.setState({leftThumb:  {x: this.leftThumb[0],  y: this.leftThumb[1],  z: this.leftThumb[2] }})
    this.setState({rightThumb: {x: this.rightThumb[0], y: this.rightThumb[1], z: this.rightThumb[1]}})
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
    const y = this.mapVal(leapPosition[1], -INTERACTION_SPACE_DEPTH, INTERACTION_SPACE_DEPTH, 0, window.innerHeight)
    const z = this.mapVal(leapPosition[2], -INTERACTION_SPACE_WIDTH, INTERACTION_SPACE_WIDTH, 0, window.innerWidth)

    const pos = [x, y, z]
    return pos

  }


  notification(type, msg) {
    this.setState({ alert: { show: true, msg: msg } });
    setTimeout(() => {
      this.setState({ alert: { show: false } });
    }, 5000);
  }
  handleClick = event => {
    event.preventDefault();
    this.setState({ active: null });

    this.notification("success", "Stopped cooking!");
  };
  acceptRecipe = receipt => {
    this.setState({ active: receipt });
  };
  handleMenu = event => {
    event.preventDefault();
    this.setState({ menu: !this.state.menu });
  };



  render() {

    let button;
    if (this.state.active) {
      button = (
        <button
          className="btn btn-outline-light my-2 my-sm-0"
          type="submit"
          onClick={this.handleClick}
        >
          Back to Receipts
        </button>
      );
    }

    const { children } = this.props

    return (
      <div className="App h-100">
        <MyProvider>
          <Router>
            <div className="h-100">
              <header className="App-header bg-info">
                <nav className="navbar">
                  <div className="d-flex align-items-center">
                    <div className="menu" onClick={this.handleMenu}>
                      J.O.
                      <div
                        className={`menumenu${
                          this.state.menu ? "" : " hidden"
                        }`}
                      >
                        <ul>
                          <li />
                          <Link to="/">Abmelden</Link>
                        </ul>
                      </div>
                    </div>
                    <MyContext.Consumer>
                      {context => (
                        <div className="ml-2 text-white">
                          Cookingtime: {context.time}m
                        </div>
                      )}
                    </MyContext.Consumer>
                  </div>
                  {button}
                </nav>

                <div
                  className={`alert ${
                    this.state.alert.show === true ? "" : " hidden"
                  }`}
                >
                  {this.state.alert.msg}
                </div>
              </header>
              <div className="wrapper">
                <Route path="/" exact component={Login} />
                <Route
                  path="/recipe/:recipe"
                  exact
                  render={props => (
                    <Receipt {...props} active={this.state.active} />
                  )}
                />
                <Route
                  path="/receipts"
                  exact
                  render={props => (
                    <Receipts
                      {...props}
                      active={this.state.active}
                      acceptRecipe={this.acceptRecipe}
                    />
                  )}
                />
              </div>
            </div>
          </Router>
          <div className="right_index" left={this.state.rightIndex.x} top={this.state.rightIndex.y}/>
          <div className="right_thumb" left={this.state.rightThumb.x} top={this.state.rightThumb.y}/>
          <div className="left_index"  left={this.state.leftIndex.x}  top={this.state.leftIndex.y}/>
          <div className="left_thumb"  left={this.state.leftThumb.x}  top={this.state.leftThumb.y}/>
        </MyProvider>
      </div>
    ); // end of return
  }
}
//
// <Modal
//   animationType='slide'
//   transparent={false},
//   visible={this.state.modalVisible},
//   onRequestClose={() => {
//     Alert.alert('Modal has been closed')
//   }}

export default App;
