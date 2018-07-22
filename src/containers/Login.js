import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    // Creating a state object. This will be where we’ll store what the user enters in the form.
    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  // Validate user input in forms
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  // Handle updating the state when the user types something into the fields
  // To have access to the 'this' keyword inside handleChange we store the reference
  // to an anonymous function: handleChange = event => { }
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Will be triggered when login form is submitted
  handleSubmit = async event => {
    // Suppress browser default behavior
    event.preventDefault();
    // Set isLoading to true to use this property to display user feedback
    this.setState({ isLoading: true });

    try {
      // Call aws-amplify's Auth method to sign in to Cognito
      // Returns a promise since it will be logging the user asynchronously
      await Auth.signIn(this.state.email, this.state.password);
      // Update isAuthenticated flag
      this.props.userHasAuthenticated(true);
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              // Set autoFocus flag for email field, so that when our 
              // form loads, it sets focus to this field.                           
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            // Span button width to full width parent
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    );
  }
}
