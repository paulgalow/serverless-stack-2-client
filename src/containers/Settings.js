import React, { Component } from "react";
import { API } from "aws-amplify";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "../components/BillingForm";
import config from "../config";
import "./Settings.css";

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };
    }

    billUser(details) {
        return API.post("notes", "/billing", {
            body: details
        });
    }

    handleFormSubmit = async (storage, { token, error }) => {
        // Check if Stripe method from BillingForm.js returned an error
        if (error) {
            alert(error);
            return;
        }

        this.setState({ isLoading: true });

        // Call our billing API
        try {
            await this.billUser({
                storage,
                source: token.id
            });

            alert("Your card has been charged successfully!");
            // Redirect user to home page
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <div className="Settings">
                {/* The StripeProvider component let's the Stripe SDK know
                that we want to call the Stripe methods using config.STRIPE_KEY.
                Also it needs to wrap around the top level of our billing form */}
                <StripeProvider apiKey={config.STRIPE_KEY}>
                    {/* The Elements component needs to wrap around any component
                    that is going to be using the CardElement Stripe component */}
                    <Elements>
                        <BillingForm
                            // Passing in the loading and onSubmit prop 
                            // to our BillingForm
                            loading={this.state.isLoading}
                            onSubmit={this.handleFormSubmit}
                        />
                    </Elements>
                </StripeProvider>
            </div>
        );
    }
}