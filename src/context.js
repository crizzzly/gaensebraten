import React, { Component } from "react";

// 1st, make a new context
export const MyContext = React.createContext();

const reducer = (state, action) => {
  console.log('action', action);
  console.log('state', state);
  
  switch (action.type) {
    case "CHANGE_TIME":
      return {
        ...state,
        time: action.value
      };
    case "COOK":
      console.log('state.doneItems.push(action.value)', state.doneItems);

      return {
        ...state,
        totalTime: state.totalTime + action.value.time,
        doneItems: [...state.doneItems, action.value]
      };
    default:
      return state;
  }
};

// 2nd, create a provider component
export class MyProvider extends Component {
  state = {
    time: 0,
    doneItems: [],
    totalTime: 0,
    dispatch: action => {
      this.setState(state => reducer(state, action));
    },
    receipts: [
      {
        title: "Gaensebraten",
        ingredients: ["Semmelknödel", "Rotkohl", "Rotkohl"],
        time: 150
      },
      {
        title: "Gegrillter Lachs",
        ingredients: ["Ratatouille", "Kräuter-Kartoffel", "Zitrone"],
        time: 120
      },
      {
        title: "Pute Piccata",
        ingredients: ["Semmelknödel", "Rotkohl"],
        time: 50
      },
      {
        title: "Semmelknödel",
        ingredients: ["Semmelbroesel", "Knoedel", "Handruehrgeraet", "Liebe"],
        time: 20
      },
      {
        title: "Hackfleisch",
        ingredients: ["Semmelbroesel", "Knoedel", "Handruehrgeraet", "Liebe"],
        time: 30
      },
      {
        title: "Mettigel",
        ingredients: ["Semmelbroesel", "Knoedel", "Handruehrgeraet", "Liebe"],
        time: 120
      },
      {
        title: "Saumagen",
        ingredients: ["Rinderhirn", "Hasenhoden", "Eichhoernchenhande", "Blutwurst"],
        time: 140
      }
    ],
  };

  // we return a context provider
  render() {
    return (
      // <MyContext.Provider value="I am the value">
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
