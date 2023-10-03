import React, { Component } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../components/CreateModal.css';



class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lname: "",
      fname: "",
      emailAdd: "",
      contactNum: "",
    };
  }

  handleInputChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { lname, fname, emailAdd, contactNum } = this.state;

    console.log("Last Name:", lname);
    console.log("First Name:", fname);
    console.log("Email Address:", emailAdd);
    console.log("Contact Number:", contactNum);

    axios
      .post("http://localhost/suico-reactjs-contactlist/PHP-APIs/add.php", {
        fname,
        lname,
        emailAdd,
        contactNum,
      })
      .then((response) => {
        // Handle success
        console.log("Server Response:", response.data);
        // Clear the form after successful submission
        this.setState({
          lname: "",
          fname: "",
          emailAdd: "",
          contactNum: "",
        });
        // Optionally, trigger a reload or update your contact list
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    const { lname, fname, emailAdd, contactNum } = this.state;

    return (
      <div>
        <button
          type="button"
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Create New Contact
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Create New Contact Detail
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="lname">Last Name</label><br/>
                  <input
                    type="text"
                    id="lname"
                    name="lname"
                    placeholder="Enter Last Name"
                    value={lname}
                    onChange={this.handleInputChange}
                    required
                    maxLength={50}
                  />
                  <br />
                  <label htmlFor="fname">First Name</label><br/>
                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder="Enter First Name"
                    value={fname}
                    onChange={this.handleInputChange}
                    required
                    maxLength={50}
                  />
                  <br />
                  <label htmlFor="emailAdd">Email Address</label><br/>
                  <input
                    type="email"
                    id="emailAdd"
                    name="emailAdd"
                    placeholder="Enter Email Address"
                    value={emailAdd}
                    onChange={this.handleInputChange}
                    required
                    maxLength={50}
                  />
                  <br />
                  <label htmlFor="contactNum">Contact Number</label><br/>
                  <input
                    type="tel"
                    id="contactNum"
                    name="contactNum"
                    placeholder="Enter Contact Number"
                    value={contactNum}
                    onChange={this.handleInputChange}
                    required
                    pattern="^\d{15}$"
                    maxLength={15}
                    title="Enter a 15-digit Mobile Number"
                  />
                  <br />
                  <button type="submit" className="btn btn-success">
                    Create Contact
                  </button>
                </form>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateModal;
