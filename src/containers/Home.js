import React, { Component } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  // Make a GET request to our API Gateway endpoint and return the results
  notes() {
    return API.get("notes", "/notes");
  }

  handleNoteClick = event => {
    event.preventDefault();
    // Redirect to note's individual page
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  // Render items in notes list
  renderNotesList(notes) {
    // Concatenate an array with an empty object with our notes array
    return [{}].concat(notes).map(
      (note, i) =>
        i !== 0
          ? <ListGroupItem
              key={note.noteId}
              href={`/notes/${note.noteId}`}
              // On click navigate to each note's respective page
              onClick={this.handleNoteClick}
              // Render the first line of each note as the ListGroupItem header
              header={note.content.trim().split("\n")[0]}
            >
              {"Created: " + new Date(note.createdAt).toLocaleString()}
            </ListGroupItem>
            // Always render a create new note button as the first item in the 
            // list (even if the list is empty).         
          : <ListGroupItem
              key="new"
              href="/notes/new"
              onClick={this.handleNoteClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new note
              </h4>
            </ListGroupItem>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {/* Render the lander or the list of notes based on this.props.isAuthenticated */}
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}
