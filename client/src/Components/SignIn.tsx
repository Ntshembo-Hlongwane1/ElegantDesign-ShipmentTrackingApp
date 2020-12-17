import React, { Component } from "react";
import "../StyleSheet/AuthForm.css";
import axios from "axios";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";
import { withRouter } from "react-router-dom";

interface IState {
  username: string | any;
  password: string | any;
}

class SignIn extends Component<any, Partial<IState>> {
  private array = window.location.href.split("/");
  private userRole = this.array[this.array.length - 1];
  private captilaziedRoleName =
    this.userRole.charAt(0).toUpperCase() + this.userRole.slice(1);
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.SignInUser = this.SignInUser.bind(this);
    this.SignInResposneAlert = this.SignInResposneAlert.bind(this);
    this.RedirectUser = this.RedirectUser.bind(this);
  }
  handleChange(e: any) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }
  RedirectUser(user_role: string) {
    const { history } = this.props;
    switch (user_role) {
      case "Admin":
        history.push("/admin-dashboard");
        window.location.reload(false);
        break;
      case "Customer":
        history.push("/customer-active-orders");
        window.location.reload(false);
        break;
      default:
        history.push("/shipment-team/assigned-deliveries");
        window.location.reload(false);
    }
  }
  SignInResposneAlert(status: number, message: string) {
    switch (status) {
      case 200:
        store.addNotification({
          title: "Sign Success",
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
          onRemoval: () => {
            const { history } = this.props;
            if (this.captilaziedRoleName === "Admin") {
              this.RedirectUser(this.captilaziedRoleName);
            } else if (this.captilaziedRoleName === "Customer") {
              this.RedirectUser(this.captilaziedRoleName);
            } else {
              this.RedirectUser(this.captilaziedRoleName);
            }
          },
        });
        break;
      case 404:
        store.addNotification({
          title: "SignIn Fail",
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
          title: "SignIn Fail",
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

  async SignInUser(e: any) {
    e.preventDefault();

    const form_data = new FormData();
    form_data.append("username", this.state.username);
    form_data.append("password", this.state.password);

    const baseURL = {
      dev: `http://localhost:5000/api/user-signin`,
      prod: "",
    };
    const url =
      process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

    try {
      const { data, status } = await axios.post(url, form_data, {
        withCredentials: true,
      });
      if (data.msg) {
        return this.SignInResposneAlert(status, data.msg);
      }
      return this.SignInResposneAlert(status, "Account Successfully Logged In");
    } catch (error) {
      const { data, status } = error.response;
      this.SignInResposneAlert(status, data.msg);
    }
  }
  render() {
    return (
      <div className="SignIn">
        <form className="Form">
          <h3 className="AuthForm__header">{`${this.captilaziedRoleName} SignIn`}</h3>
          <label>Username</label>
          <input
            type="text"
            placeholder="username"
            required
            className="inputField"
            id="username"
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
          <button className="btn btn-signup" onClick={this.SignInUser}>
            SignIn
          </button>
        </form>
        <ReactNotification className="Notifaction-card" />
      </div>
    );
  }
}

export default withRouter(SignIn);
