import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  render() {
    return (
      <div className="Login bg-primary">
        <div className="">
          <h1 className="text-white">Handfree cookbook</h1>
          <h2 className="text-white">Please sign in</h2>
          <div className="my-4">
            <input
              placeholder="username"
              className="form-control"
              type="text"
              name="username"
            />
            <input
              className="form-control"
              type="password"
              name="p assword"
              placeholder="password"
            />
          </div>
          <div className="checkbox mb-3">
            <label className="text-white">
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          <Link className="btn btn-lg btn-outline-light btn-block" to="/receipts/">
            Login
          </Link>
        </div>
      </div>
    );
  }
}

export default Login;
