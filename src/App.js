import React, { Component, Fragment } from "react";
import { Auth } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    // Initialize isAuthenticated flag in the App's state
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  // Load the user session: componentDidMount() is invoked by React
  // immediately after a component is mounted (inserted into the tree)
  async componentDidMount() {
    // Check if a session object is returned
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      // Do not display standard alert, when users aren't logged in
      // Only return different errors
      if (e !== 'No current user') {
        alert(e);
      }
    }
    // A session object has been returned, update isAuthenticating flag
    this.setState({ isAuthenticating: false });
  }

  // When called updates App's authentication status
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  // Handle logging out
  handleLogout = async event => {
    // Clean browser local storage
    await Auth.signOut();
    // Update isAuthenticated flag
    this.userHasAuthenticated(false);
    // Redirect user to login window
    this.props.history.push("/login");
  }

  render() {
    // Create state to pass on to child containers via Routes.js
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      // Hold off rendering our app until isAuthenticating is false since 
      // loading the user session is an asynchronous process
      !this.state.isAuthenticating &&
      // Create a fixed width container
      <div className="App container">
        {/* Add a navigation bar that fits to the container's width using 'fluid' */}
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              {/* Using Link component from React-Router to handle the link to our 
              app's homepage without forcing a browser refresh */}
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            {/* Activate hamburger menu */}
            <Navbar.Toggle />
          </Navbar.Header>
          {/* Create navigation items */}
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                // Fragments store a group of children without wrapping them inside a div
                ? <Fragment>
                    <LinkContainer to="/settings">
                      <NavItem>Settings</NavItem>
                    </LinkContainer>
                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                  </Fragment>
                : <Fragment>
                    <LinkContainer to="/signup">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

// Export app including withRouter higher order component to get access to router props
export default withRouter(App);
