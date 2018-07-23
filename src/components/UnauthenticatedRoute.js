/*
Route to ensure that a user is NOT authenticated

Here we are checking to ensure that the user is not authenticated before 
we render the component that is passed in. And in the case where the user 
is authenticated, we use the Redirect component to simply send the user 
to the homepage.
*/
import React from "react";
import { Route, Redirect } from "react-router-dom";

// Read the redirect URL from the querystring so we can redirect our user
// to the desired location after successful login.
// Method takes the querystring parameter we want to read and returns it
function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default ({ component: C, props: cProps, ...rest }) => {
  const redirect = querystring("redirect");
  return (
    <Route
      {...rest}
      render={props =>
        !cProps.isAuthenticated
          ? <C {...props} {...cProps} />
          : <Redirect
              to={redirect === "" || redirect === null ? "/" : redirect}
            />}
    />
  );
};
