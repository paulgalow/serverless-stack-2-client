// React Stripe Elements documentation: https://github.com/stripe/react-stripe-elements

import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { CardElement, injectStripe } from "react-stripe-elements";
import LoaderButton from "./LoaderButton";
import "./BillingForm.css";

class BillingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            storage: "",
            isProcessing: false,
            isCardComplete: false
        };
    }

    // Validates the form by checking if the name, the number of notes, 
    // and the card details are complete
    validateForm() {
        return (
            this.state.name !== "" &&
            this.state.storage !== "" &&
            this.state.isCardComplete
        );
    }

    handleFieldChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleCardFieldChange = event => {
        this.setState({
            isCardComplete: event.complete
        });
    }

    handleSubmitClick = async event => {
        event.preventDefault();

        const { name } = this.state;

        this.setState({ isProcessing: true });

        const { token, error } = await this.props.stripe.createToken({ name });

        this.setState({ isProcessing: false });

        this.props.onSubmit(this.state.storage, { token, error });
    }

    render() {
        const loading = this.state.isProcessing || this.props.loading;

        return (
            <form className="BillingForm" onSubmit={this.handleSubmitClick}>
                {/* Field to enter the number of notes the user wants to store */}
                <FormGroup bsSize="large" controlId="storage">
                    <ControlLabel>Storage</ControlLabel>
                    <FormControl
                        min="0"
                        type="number"
                        value={this.state.storage}
                        onChange={this.handleFieldChange}
                        placeholder="Number of notes to store"
                    />
                </FormGroup>
                <hr />
                {/* Field to enter cardholder's name */}
                <FormGroup bsSize="large" controlId="name">
                    <ControlLabel>Cardholder&apos;s name</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.name}
                        onChange={this.handleFieldChange}
                        placeholder="Name on the card"
                    />
                </FormGroup>
                <ControlLabel>Credit Card</ControlLabel>
                {/* The credit card number form is provided by the Stripe React SDK through 
                the CardElement component */}
                <CardElement
                    className="card-field"
                    onChange={this.handleCardFieldChange}
                    style={{
                        base: { fontSize: "18px", fontFamily: '"Open Sans", sans-serif' }
                    }}
                />
                {/* The submit button has a loading state that is set to true when we call Stripe 
                to get a token and when we call our billing API. However, since our Settings 
                container is calling the billing API we use the this.props.loading which is set
                by the parent component, i.e. the Settings container. */}
                <LoaderButton
                    block
                    bsSize="large"
                    type="submit"
                    text="Purchase"
                    isLoading={loading}
                    loadingText="Purchasing…"
                    disabled={!this.validateForm()}
                />
            </form>
        );
    }
}

// Wrapping our component with a Stripe module using the injectStripe HOC. 
// This gives our component access to the this.props.stripe.createToken method.
export default injectStripe(BillingForm);