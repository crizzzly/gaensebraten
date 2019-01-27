import React, { Component } from "react";
import { MyContext } from "./context";

class Setting extends Component {
  render() {
    return (

        <MyContext.Consumer>
        {context => {
        const { dispatch } = context;
        return (
            <div>
            <div className="slider">
                <div className="">
                <button>-</button>5 min.
                <button>+</button>
                </div>
                <br />
            </div>
            Change cookingtime:
            <input
                ref={this.slider}
                className="bar"
                onChange={e =>
                dispatch({
                    type: "changeTime",
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
    )
  }
}
export default Setting;
