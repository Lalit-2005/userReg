import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_URL = "http://localhost:8080/api/employees";

const App = () => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    empCode: "",
    gender: "",
    location: "",
    department: "",
    dob: "",
    employmentStatus: "",
    email: "",
    startDate: "",
    jobTitle: "",
  });

  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all employees on load
  useEffect(() => {
    getAllEmployees();
  }, []);

  const getAllEmployees = async () => {
    const res = await axios.get(API_URL);
    setEmployees(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, employee);
      alert("Employee updated successfully!");
      setEditingId(null);
    } else {
      await axios.post(API_URL, employee);
      alert("Employee added successfully!");
    }
    setEmployee({
      firstName: "",
      lastName: "",
      empCode: "",
      gender: "",
      location: "",
      department: "",
      dob: "",
      employmentStatus: "",
      email: "",
      startDate: "",
      jobTitle: "",
    });
    getAllEmployees();
  };

  const handleEdit = (emp) => {
    setEmployee(emp);
    setEditingId(emp.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await axios.delete(`${API_URL}/${id}`);
      getAllEmployees();
    }
  };

  return (
    <div
      className="main d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="p-4 rounded shadow bg-white"
        style={{
          width: "90%",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h3 className="text-center mb-4 fw-bold">
          {editingId ? "Edit Employee" : "Add Employee"}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="row1 row mb-3">
            <div className="col1 col">
              <label>First Name *</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={employee.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col2 col">
              <label>Last Name *</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={employee.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="row2 row mb-3">
            <div className="col1 col">
              <label>Employee Code *</label>
              <input
                type="text"
                className="form-control"
                name="empCode"
                value={employee.empCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col2 col">
              <label>Gender *</label>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={employee.gender === "Male"}
                  onChange={handleChange}
                  required
                />{" "}
                Male
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={employee.gender === "Female"}
                  onChange={handleChange}
                  className="ms-3"
                />{" "}
                Female
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="row3 row mb-3">
            <div className="col1 col">
              <label>Location *</label>
              <select
                className="form-control"
                name="location"
                value={employee.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                <option value="Sydney">Sydney</option>
                <option value="Noida">Noida</option>
                <option value="Romania">Romania</option>
              </select>
            </div>
            <div className="col2 col">
              <label>Department *</label>
              <select
                className="form-control"
                name="department"
                value={employee.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Administration">Administration</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="row4 row mb-3">
            <div className="col1 col">
              <label>Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={employee.dob}
                onChange={handleChange}
              />
            </div>
            <div className="col2 col">
              <label>Employment Status *</label>
              <select
                className="form-control"
                name="employmentStatus"
                value={employee.employmentStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Row 5 */}
          <div className="row5 row mb-3">
            <div className="col1 col">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={employee.email}
                onChange={handleChange}
              />
            </div>
            <div className="col2 col">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={employee.startDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="row6 mb-3">
            <label>Position / Job Title</label>
            <input
              type="text"
              className="form-control"
              name="jobTitle"
              value={employee.jobTitle}
              onChange={handleChange}
            />
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-4">
              {editingId ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>

        <hr className="my-4" />

        {/* Employee Table */}
        <h4 className="text-center mb-3">Employee List</h4>
        <div style={{ maxHeight: "250px", overflowY: "auto" }}>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Location</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.empCode}</td>
                    <td>{emp.location}</td>
                    <td>{emp.department}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(emp)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">No Employees Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
