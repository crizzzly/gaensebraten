import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MyProvider, MyContext } from "./context";

import "./UserInterface.css";
import Login from "./Login";
import Receipt from "./Receipt";
import Receipts from "./Receipts";
import { LeapProvider, withLeapContainer } from "./leap";

class UserInterface extends Component {
  state = {
    active: null,

    alert: {
      show: false,
      msg: ""
    }
  };

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

  // functions to set the circle position according to finger tip position detected by leap
  restrictPosToRange(value, min, max) {
    if (value > max) {
      return max;
    }
    if (value < min) {
      return min;
    }
    return value;
  }
  getHands(frame) {
    return frame.hands;
  }
  getFingerScreenPosition(leapPosition, spaceSize) {
    const heightStartScale = 100;
    const widthRatio = window.innerWidth / (2 * spaceSize);
    const heightRatio = window.innerHeight / (2 * spaceSize);
    const x = this.restrictPosToRange(leapPosition[0], -spaceSize, spaceSize);
    const y = this.restrictPosToRange(
      leapPosition[1] - heightStartScale - spaceSize,
      -spaceSize,
      spaceSize
    );
    const z = leapPosition[2];
    const xNorm = x * widthRatio;
    const yNorm = y * heightRatio;
    const normalizedPosition = [xNorm, yNorm, z];
    return normalizedPosition;
  }
  itemStyle(item) {
    return Object.assign({}, item.style, {
      transform: `translate3d(${item.pos[0]}px, ${item.pos[1]}px, ${
        item.pos[2]
      }px)`
    });
  }

  render() {
    const frame = withLeapContainer(this); //withLeapContainer(this);

    const hands = frame.hands
    const spaceSize = 50; // for what!? --> find out
    let rightThumb = 0;
    let rightIndex = 0;
    let leftThumb = 0;
    let leftIndex = 0;
    let fingers = [];

    if (hands && hands.length) {
      console.log("found hands");
      hands.forEach((hand, index) => {
        if (hand.type === "left") {
          leftIndex = this.getFingerScreenPosition(hand.thumb.dipPosition);
          leftThumb = this.getFingerScreenPosition(
            hand.indexFinger.dipPosition
          );
          fingers[index] = [leftIndex, leftThumb];
          console.log("left hand: " + leftIndex + ", " + leftThumb);
        } else {
          rightIndex = this.getFingerScreenPosition(hand.thumb.dipPosition);
          rightThumb = this.getFingerScreenPosition(
            hand.indexFinger.dipPosition
          );
          fingers[index] = [rightIndex, rightThumb];
          console.log("right hand: " + rightIndex + ", " + rightThumb);
        }
      });
    }
    else{
      console.log("no hands")
    } // end of hands-scan

    fingers.forEach((finger, index) => {
      console.log(index + ": " + finger);
    });

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

    return (
      <div className="UserInterface h-100">
        <LeapProvider options={{ enableGestures: true }}>
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
            <div className="right_index" />
          </MyProvider>
        </LeapProvider>
      </div>
    ); // end of return
  }
}

export default withLeapContainer(UserInterface);
