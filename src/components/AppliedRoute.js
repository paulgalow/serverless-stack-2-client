// This component creates a Route where the child component that it renders 
// contains the passed in props.
// See: https://serverless-stack.com/chapters/add-the-session-to-the-state.html
import React from "react";
import { Route } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) =>
  <Route {...rest} render={props => <C {...props} {...cProps} />} />;