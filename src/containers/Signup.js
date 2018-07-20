import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      // Make a call to Cognito to signup a user. This returns a new user object.
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      // Save new user object to the state as newUser
      this.setState({ newUser });
    } catch (e) {
        // User name already exists, resend confirmation code to user's e-mail address
        if (e.name === "UsernameExistsException") {
          this.setState({ usernameExists: true });
          try {
              const newUser = await Auth.resendSignUp(this.state.email);
              // Save new user object to the state as newUser
              this.setState({ newUser });
          } catch (e) {
              // User has already entered his confirmation code successfully
              if (e.message === "User is already confirmed.") {
                  // Login user
                  await Auth.signIn(this.state.email, this.state.password);
                  // Update app's state
                  this.props.userHasAuthenticated(true);
                  // Redirect user to homepage
                  this.props.history.push("/");
              } else {
                  alert(e.message);
              }                    
            }                                    
          } else {
            alert(e.message);
          }
    }
    this.setState({ isLoading: false });
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      // Submit user e-mail and confirmation code to Cognito
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      // Login user
      await Auth.signIn(this.state.email, this.state.password);
      // Update app's state
      this.props.userHasAuthenticated(true);
      // Redirect user to homepage
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          {/* Display user information based on username registration status */}
          {this.state.usernameExists
            ? <HelpBlock>You are already registered. Resending verification code to {this.state.email}</HelpBlock>
            : <HelpBlock>Please check your email for the code.</HelpBlock>}
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
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
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          // If we don't have a user object, load sign up form
          ? this.renderForm()
          // If we do have a user object, load confirmation code form
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
