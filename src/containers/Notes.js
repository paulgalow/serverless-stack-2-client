import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./Notes.css";

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: "",
      attachmentURL: null
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      // Load the note by calling getNote()
      const note = await this.getNote();
      const { content, attachment } = note;

      // If there is an attachment, we use the key to get a secure link to the file
      // we uploaded to S3. We then store this to the component's state as attachmentURL
      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        note,
        content,
        attachmentURL
      });
    } catch (e) {
      alert(e);
    }
  }

  // Handles loading of notes from DynamoDB. We get the note id from the URL using 
  // the props automatically passed to us by React-Router in 'this.props.match.params.id'.
  // They keyword 'id' is a part of the pattern matching in our route (/notes/:id).
  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  // Using AWS Amplify make a PUT request with the note object to /notes/:id where we get 
  // the id from 'this.props.match.params.id'.
  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

  // Using AWS Amplify to make a DELETE request to /notes/:id which calls our delete API
  deleteNote() {
    return API.del("notes", `/notes/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  // We format the attachment URL using formatFilename by stripping the timestamp we 
  // had added to the filename while uploading it.
  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    let attachment;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      // If there is a file to upload we call s3Upload to upload it and save 
      // the key we get from S3.
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      // Save note by calling saveNote()
      await this.saveNote({
        content: this.state.content,
        // Save attachment key of newly uploaded file or take the key of an 
        // already uploaded attachment
        attachment: attachment || this.state.note.attachment
      });
      // On success redirect the user to the home page
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleDelete = async event => {
    event.preventDefault();

    // Asks user to confirm if they want to delete the note
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      // Delete note
      await this.deleteNote();
      // await s3Delete(this.state.note.attachment);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Notes">
        {/* We render our form only when this.state.note is available */}
        {this.state.note &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {/* Display attachment block if attachment is available */}
            {this.state.note.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="file">
              {!this.state.note.attachment &&
                <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            {/* Save button */}
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            {/* Delete button */}
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}
