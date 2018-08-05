import React from "react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

// Handle code splitting / import of components using "react-loadable"
const Loading = ({ isLoading, pastDelay, error }) => {
	// Handle the loading state once delay has passed to avoid flickering
	// of components that load very quickly
	if (isLoading && pastDelay) {
			return <div>Loading…</div>;
	}
	// Handle the error state
	else if (error) {
			return <div>Sorry, there was a problem loading the page.</div>;
	}
	else {
			return null;
	}
};

// Load our containers using react-loadable's 'Loadable'
const AsyncImport = container =>
	Loadable({
		loader: () => import("./containers/" + container),
		loading: Loading
	});

// We're using the Switch component from React-Router to render the first matching route defined
export default ({ childProps }) =>
	<Switch>
		{/* Route to home page */}
		<AppliedRoute 
			path="/" 
			exact 
			component={AsyncImport("Home")} 
			props={childProps} 
		/>
		{/* Route to login page */}
		<UnauthenticatedRoute 
			path="/login" 
			exact 
			component={AsyncImport("Login")} 
			props={childProps} 
		/>
		{/* Route to signup page */}
		<UnauthenticatedRoute 
			path="/signup" 
			exact 
			component={AsyncImport("Signup")} 
			props={childProps} 
		/>
		{/* Route to settings page */}
		<AuthenticatedRoute 
			path="/settings" 
			exact 
			component={AsyncImport("Settings")} 
			props={childProps} 
		/>
		{/* Route to create a new note */}
		<AuthenticatedRoute 
			path="/notes/new" 
			exact 
			component={AsyncImport("NewNote")} 
			props={childProps} 
		/>
		{/* Route to specific note */}
		<AuthenticatedRoute 
			path="/notes/:id" 
			exact 
			component={AsyncImport("Notes")} 
			props={childProps} 
		/>
		{ /* Finally, catch all unmatched routes */ }
		<Route 
			component={AsyncImport("NotFound")} 
		/>
	</Switch>;