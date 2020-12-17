import React, { Component } from "react";
import "../StyleSheet/NewOrderForm.css";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";
import axios from "axios";

interface IState {
  owner_fullName: string | any;
  owner_email: string | any;
  owner_phoneNumber: number | any;

  Item_name: string | any;
  Item_weight: string | any;
  Item_primaryLocation: string | any;
  Item_destination: string | any;
  Item_ID: string | any;
}

class TakeNewOrder extends Component<any, Partial<IState>> {
  constructor(props: any) {
    super(props);
    this.state = {
      owner_fullName: "",
      owner_email: "",
      owner_phoneNumber: "",

      Item_name: "",
      Item_weight: "",
      Item_primaryLocation: "",
      Item_destination: "",
      Item_ID: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.AddItem = this.AddItem.bind(this);
    this.serverResponseAlert = this.serverResponseAlert.bind(this);
  }

  handleChange(e: any) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  serverResponseAlert(status: number, message: string) {
    switch (status) {
      case 500:
        store.addNotification({
          title: "Shipment Order Creation Fail",
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
      case 400:
        store.addNotification({
          title: "Shipment Order Creation Fail",
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
      case 201:
        store.addNotification({
          title: "Shipment Order Creation Success",
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
    }
  }

  async AddItem(e: any) {
    e.preventDefault();

    const form_data = new FormData();
    form_data.append("owner_fullName", this.state.owner_fullName);
    form_data.append("owner_email", this.state.owner_email);
    form_data.append("owner_phoneNumber", this.state.owner_phoneNumber);
    form_data.append("Item_name", this.state.Item_name);
    form_data.append("Item_weight", this.state.Item_weight);
    form_data.append("Item_primaryLocation", this.state.Item_primaryLocation);
    form_data.append("Item_destination", this.state.Item_destination);
    form_data.append("Item_ID", this.state.Item_ID);

    const baseURL = {
      dev: "http://localhost:5000/api/create-new-order",
      prod: "",
    };

    const url =
      process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

    try {
      const { data, status } = await axios.post(url, form_data, {
        withCredentials: true,
      });

      this.serverResponseAlert(status, data.msg);
    } catch (error) {
      const { data, status } = error.response;
      this.serverResponseAlert(status, data.msg);
    }
  }
  render() {
    return (
      <div className="TakeNewOrder__Form">
        <form className="NewOrder__Form">
          <div className="Form__ownerDetail">
            <h3 className="NewOrder__FormHeader">Owner Of Items Detail</h3>
            <label>Item Owner (FullName)</label>
            <input
              onChange={this.handleChange}
              className="inputField"
              type="text"
              placeholder="Owner of item"
              required
              id="owner_fullName"
            />
            <label>Owners Email</label>
            <input
              onChange={this.handleChange}
              className="inputField"
              type="email"
              placeholder="Owner's email"
              required
              id="owner_email"
            />
            <label>Owners Phone Number</label>
            <input
              onChange={this.handleChange}
              className="inputField"
              type="number"
              placeholder="Owner's Phone number"
              required
              id="owner_phoneNumber"
            />
          </div>
          <div className="Form__itemDetail">
            <h3 className="NewOrder__FormHeader">Item Detail</h3>
            <label>Item ID</label>
            <input
              type="text"
              placeholder="Item Unique ID"
              id="Item_ID"
              required
              className="inputField"
              onChange={this.handleChange}
            />
            <label>Item Name</label>
            <input
              onChange={this.handleChange}
              className="inputField"
              type="text"
              placeholder="Item Name"
              required
              id="Item_name"
            />
            <label>Item Weight(Kg)</label>
            <input
              onChange={this.handleChange}
              className="inputField"
              type="number"
              placeholder="Item weight"
              id="Item_weight"
              required
            />
            <label>Where Item is coming from</label>
            <input
              onChange={this.handleChange}
              className="inputField"
              type="text"
              placeholder="Location where item is coming from"
              id="Item_primaryLocation"
              required
            />
            <label>Where Item is going</label>
            <input
              onChange={this.handleChange}
              className="inputField"
              type="text"
              placeholder="Where Item is going"
              id="Item_destination"
              required
            />
            <button className="btn" onClick={this.AddItem}>
              Add Item
            </button>
          </div>
        </form>
        <ReactNotification className="Notifaction-card" />
      </div>
    );
  }
}

export default TakeNewOrder;
