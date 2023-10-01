import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedContactId: null,
            isModalOpen: false,
            selectedContactLastName: '',
            selectedContactFirstName: '',
            emailAdd: '',
            selectedCurrEmailAdd: '',
            selectedNumber: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost/suico-reactjs-contactlist/PHP-APIs/read.php')
            .then(response => {
                this.setState({ data: response.data });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    handleDeleteContact = (id) => {
        console.log("Deleting contact with ID:", id);
        axios.get(`http://localhost/suico-reactjs-contactlist/PHP-APIs/delete.php?id=${id}`)
            .then((response) => {
                console.log("Server Response:", response.data);
                if (response.data.status === 200) {
                    window.location.reload();
                } else {
                    console.error("Delete failed:", response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error deleting contact:", error);
            });
    };

    handleUpdateContact = (id, lastName, firstName, emailAdd, curEmail, number) => {
        this.setState({
            selectedContactId: id,
            isModalOpen: true,
            selectedContactLastName: lastName,
            selectedContactFirstName: firstName,
            emailAdd: emailAdd,
            selectedCurrEmailAdd: curEmail,
            selectedNumber: number
        });
    }

    handleSubmit = (event) => {
        // event.preventDefault(); // Prevent the default form submission behavior

        // Gather the data you want to submit
        const {
            selectedContactId,
            selectedContactLastName,
            selectedContactFirstName,
            emailAdd,
            selectedCurrEmailAdd,
            selectedNumber
        } = this.state;

        // Prepare the data to send to the PHP backend
        const data = {
            id: selectedContactId,
            firstName: selectedContactFirstName,
            lastName: selectedContactLastName,
            emailAdd: emailAdd,
            contactNum: selectedNumber,
            curEmail: selectedCurrEmailAdd
        };

        // Send the data to the PHP backend
        axios.post("http://localhost/suico-reactjs-contactlist/PHP-APIs/edit.php", data)
            .then((response) => {
                console.log("Server Response:", response.data);
                // Handle the response from the backend, e.g., close the modal if successful
                if (response.data.status === 200) {
                    this.handleCloseModal();
                } else {
                    console.error("Update failed:", response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error updating contact:", error);
            });
    }

    handleCloseModal = () => {
        this.setState({
            selectedContactId: null,
            isModalOpen: false,
        });
    }

    handleLastNameChange = (event) => {
        this.setState({ selectedContactLastName: event.target.value });
    }
    handleFirstNameChange = (event) => {
        this.setState({ selectedContactFirstName: event.target.value });
    }
    handleNewEmailAddressChange = (event) => {
        this.setState({ emailAdd: event.target.value });
    }
    handleCurrEmailAddressChange = (event) => {
        this.setState({ selectedCurrEmailAdd: event.target.value });
    }
    handleContactNumberChange = (event) => {
        this.setState({ selectedNumber: event.target.value });
    }

    render() {
        const getData = this.state.data;
        const tableRows = [];
        for (let x = 0; x < getData.count; x++) {
            tableRows.push(
                <tr key={x}>
                    <td>{getData.data[x].id}</td>
                    <td>{getData.data[x].lastName}</td>
                    <td>{getData.data[x].firstName}</td>
                    <td>{getData.data[x].email}</td>
                    <td>{getData.data[x].number}</td>
                    <td>
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => this.handleUpdateContact(getData.data[x].id, getData.data[x].lastName, getData.data[x].firstName, getData.data[x].email, getData.data[x].email, getData.data[x].number)}
                        >
                            Update
                        </button>
                    </td>
                    <td>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => this.handleDeleteContact(getData.data[x].id)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        }

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr className="table-dark">
                            <th scope="col">ID</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Email Address</th>
                            <th scope="col">Contact Number</th>
                            <th scope="col">Update Contact</th>
                            <th scope="col">Delete Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
                {this.state.isModalOpen && (
                    <Modal show={this.state.isModalOpen} onHide={this.handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Contact #{this.state.selectedContactId} Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={this.handleSubmit}>
                                <label htmlFor="lastName">Last Name</label><br />
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={this.state.selectedContactLastName}
                                    onChange={this.handleLastNameChange}
                                /><br />
                                <label htmlFor="firstName">First Name</label><br />
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={this.state.selectedContactFirstName}
                                    onChange={this.handleFirstNameChange}
                                /><br />
                                <label htmlFor="curEmail">Old Email Address</label><br />
                                <input
                                    type="email"
                                    id="curEmail"
                                    name="curEmail"
                                    readOnly
                                    value={this.state.selectedCurrEmailAdd}
                                    onChange={this.handleCurrEmailAddressChange}
                                /><br />
                                <label htmlFor="emailAdd">New Email Address</label><br />
                                <input
                                    type="email"
                                    id="emailAdd"
                                    name="emailAdd"
                                    placeholder="Enter New Email Address"
                                    onChange={this.handleNewEmailAddressChange}
                                /><br />
                                <label htmlFor="contactNum">New Contact Number</label><br />
                                <input
                                    type="tel"
                                    id="contactNum"
                                    name="contactNum"
                                    value={this.state.selectedNumber}
                                    onChange={this.handleContactNumberChange}
                                />
                                <button type="submit" className="btn btn-warning">Update Contact</button>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            {/* Add your modal footer content here */}
                        </Modal.Footer>
                    </Modal>
                )}
            </div>
        );
    }
}

export default TableComponent;
