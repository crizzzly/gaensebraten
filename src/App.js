import React, { Component } from "react";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { MyProvider, MyContext } from "./context";

import "./App.css";
import UserInterface from './UserInterface'
// import {Modal, Alert} from 'react-native'

class App extends Component {
  state = {
    active: null,
    // modalVisible: false

    alert: {
      show: false,
      msg: ""
    }
  };

  // setModalVisible(visible){
  //   this.setState({modalVisible(visible)})
  // }



  render() {
    return (
        <div className="App">
            <UserInterface />
        </div>
    );
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
