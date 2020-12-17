import React, { Component } from "react";
import "../StyleSheet/AuthForm.css";
import axios from "axios";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";

interface IState {
  username: string | any;
  email: string | any;
  password: string | any;
  verifiedPassword: string | any;
}

class SignUp extends Component<any, Partial<IState>> {
  private array = window.location.href.split("/");
  private userRole = this.array[this.array.length - 1];
  private captilaziedRoleName =
    this.userRole.charAt(0).toUpperCase() + this.userRole.slice(1);

  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      verifiedPassword: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.PasswordNotMatchingAlert = this.PasswordNotMatchingAlert.bind(this);
    this.SignUpUser = this.SignUpUser.bind(this);
    this.SignUpServerResponseAlert = this.SignUpServerResponseAlert.bind(this);
  }

  handleChange(e: any) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  PasswordNotMatchingAlert() {
    store.addNotification({
      title: "Password's Not Matching",
      message: "Verify Your Password",
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  }

  SignUpServerResponseAlert(status: number, message: string) {
    switch (status) {
      case 201:
        store.addNotification({
          title: "Account Creation Success",
          message: message,
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate_fadeIn"],
          animationOut: ["animate__animated", "animate_fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        break;
      case 400:
        store.addNotification({
          title: "Account Creation Fail",
          message: message,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate_fadeIn"],
          animationOut: ["animate__animated", "animate_fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        break;
      case 500:
        store.addNotification({
          title: "Account Creation Fail",
          message: message,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate_fadeIn"],
          animationOut: ["animate__animated", "animate_fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        break;
    }
  }

  async SignUpUser(e: any) {
    e.preventDefault();

    if (this.state.password !== this.state.verifiedPassword) {
      return this.PasswordNotMatchingAlert();
    }

    const form_data = new FormData();
    form_data.append("username", this.state.username);
    form_data.append("email", this.state.email);
    form_data.append("password", this.state.password);

    const baseURL = {
      dev: `http://localhost:5000/api/user-signup/${this.userRole}`,
      prod: "",
    };
    const url =
      process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

    try {
      const { data, status } = await axios.post(url, form_data, {
        withCredentials: true,
      });
      this.SignUpServerResponseAlert(status, data.msg);
    } catch (error) {
      const { data, status } = error.response;
      this.SignUpServerResponseAlert(status, data.msg);
    }
  }
  render() {
    return (
      <div className="SignUp">
        <form className="Form">
          <h3 className="AuthForm__header">{`${this.captilaziedRoleName} SignUp`}</h3>
          <label>Username</label>
          <input
            type="text"
            placeholder="username"
            required
            className="inputField"
            id="username"
            onChange={this.handleChange}
          />
          <label>Email</label>
          <input
            type="emal"
            placeholder="email"
            required
            className="inputField"
            id="email"
            onChange={this.handleChange}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            required
            className="inputField"
            id="password"
            onChange={this.handleChange}
          />
          <label>Confirm Passowrd</label>
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="inputField"
            id="verifiedPassword"
            onChange={this.handleChange}
          />
          <button className="btn btn-signup" onClick={this.SignUpUser}>
            SignUp
          </button>
        </form>
        <ReactNotification className="Notifaction-card" />
      </div>
    );
  }
}

export default SignUp;
