import React, { Component } from "react";
import { MyContext } from "./context";

class Setting extends Component {
  slider = React.createRef();

  render() {
      console.log('this.props', this.props);
      
    return (
      <MyContext.Consumer>
        {context => {
          const { dispatch } = context;
          
          return (
            <div>
              <div className="slider">
                <div className="">
                  <button>-</button>
                  {this.props.active.time } min.
                  <button>+</button>
                </div>
                <br />
              </div>
              Kochzeit aendern:
              <input
                ref={this.slider}
                className="bar"
                onChange={e =>
                  dispatch({
                    type: "CHANGE_TIME",
                    value: this.slider.current.value
                  })
                }
                type="range"
                id="rangeinput"
              />
            </div>
          );
        }}
      </MyContext.Consumer>
    );
  }
}
export default Setting;
