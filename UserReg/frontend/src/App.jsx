import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_URL = "https://user-backend-4e07.onrender.com/api/employees";

const todayISO = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t.toISOString().split("T")[0];
};

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [alert, setAlert] = useState(null);
  const alertTimerRef = useRef(null);

  useEffect(() => {
    getAllEmployees();
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  const getAllEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("danger", ["Failed to load employees"]);
    }
  };

  const showAlert = (type, messages) => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }
    setAlert({ type, messages: Array.isArray(messages) ? messages : [messages] });
    alertTimerRef.current = setTimeout(() => {
      setAlert(null);
      alertTimerRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    const newErrors = validate(employee, employees, editingId);
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [employee, employees, editingId]);

  const validate = (emp, list, editId) => {
    const e = {};

    if (!emp.firstName.trim()) e.firstName = "First name is required";
    if (!emp.lastName.trim()) e.lastName = "Last name is required";

    if (!emp.empCode.trim()) e.empCode = "Employee Code is required";
    else if (!/^\d+$/.test(emp.empCode)) e.empCode = "Employee Code must be digits only";
    else {
      const duplicate = list.some(
        (x) => String(x.empCode) === String(emp.empCode) && x.id !== editId
      );
      if (duplicate) e.empCode = "Employee Code already exists";
    }

    if (!emp.gender) e.gender = "Gender is required";
    if (!emp.location) e.location = "Location is required";
    if (!emp.department) e.department = "Department is required";
    if (!emp.employmentStatus) e.employmentStatus = "Employment status is required";

    if (emp.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email))
      e.email = "Enter a valid email";

    if (emp.dob && !(emp.dob < todayISO())) e.dob = "DOB must be before today";
    if (emp.startDate && emp.dob && emp.startDate < emp.dob)
      e.startDate = "Start date cannot be before DOB";

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(employee).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);

    const finalErrors = validate(employee, employees, editingId);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      showAlert("danger", Object.values(finalErrors));
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, employee);
        showAlert("success", "Employee updated successfully");
        setEditingId(null);
      } else {
        await axios.post(API_URL, employee);
        showAlert("success", "Employee added successfully");
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

      setTouched({});
      getAllEmployees();
    } catch {
      showAlert("danger", "Failed to save employee");
    }
  };

  const handleEdit = (emp) => {
    setEmployee({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      empCode: emp.empCode || "",
      gender: emp.gender || "",
      location: emp.location || "",
      department: emp.department || "",
      dob: emp.dob || "",
      employmentStatus: emp.employmentStatus || "",
      email: emp.email || "",
      startDate: emp.startDate || "",
      jobTitle: emp.jobTitle || "",
    });
    setEditingId(emp.id);
    setTouched({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlert("success", "Employee deleted");
      getAllEmployees();
    } catch {
      showAlert("danger", "Failed to delete employee");
    }
  };

  return (
    <div
      className="main d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f8f9fa",
        padding: "40px 0",
      }}
    >
      <div className="p-4 rounded shadow bg-white" style={{ width: "95%", maxWidth: "900px" }}>
        <h3 className="text-center mb-3 fw-bold">
          {editingId ? "Edit Employee" : "Add Employee"}
        </h3>

        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.messages.length === 1 ? (
              <div>{alert.messages[0]}</div>
            ) : (
              <ul className="mb-0">
                {alert.messages.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                className={`form-control ${
                  touched.firstName && errors.firstName ? "is-invalid" : ""
                }`}
                value={employee.firstName}
                onChange={handleChange}
              />
              {touched.firstName && errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>

            <div className="col-md-6 mb-2">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                className={`form-control ${
                  touched.lastName && errors.lastName ? "is-invalid" : ""
                }`}
                value={employee.lastName}
                onChange={handleChange}
              />
              {touched.lastName && errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <label>Employee Code *</label>
              <input
                type="text"
                name="empCode"
                inputMode="numeric"
                className={`form-control ${
                  touched.empCode && errors.empCode ? "is-invalid" : ""
                }`}
                value={employee.empCode}
                onChange={handleChange}
              />
              {touched.empCode && errors.empCode && (
                <div className="invalid-feedback">{errors.empCode}</div>
              )}
            </div>

            <div className="col-md-6 mb-2">
              <label>Gender *</label>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={employee.gender === "Male"}
                  onChange={handleChange}
                  className={`form-check-input me-1 ${
                    touched.gender && errors.gender ? "is-invalid" : ""
                  }`}
                />
                Male
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={employee.gender === "Female"}
                  onChange={handleChange}
                  className={`form-check-input ms-3 me-1 ${
                    touched.gender && errors.gender ? "is-invalid" : ""
                  }`}
                />
                Female
                {touched.gender && errors.gender && (
                  <div className="invalid-feedback d-block">{errors.gender}</div>
                )}
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <label>Location *</label>
              <select
                name="location"
                className={`form-select ${
                  touched.location && errors.location ? "is-invalid" : ""
                }`}
                value={employee.location}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Sydney">Sydney</option>
                <option value="Noida">Noida</option>
                <option value="Romania">Romania</option>
              </select>
              {touched.location && errors.location && (
                <div className="invalid-feedback">{errors.location}</div>
              )}
            </div>

            <div className="col-md-6 mb-2">
              <label>Department *</label>
              <select
                name="department"
                className={`form-select ${
                  touched.department && errors.department ? "is-invalid" : ""
                }`}
                value={employee.department}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Administration">Administration</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
              {touched.department && errors.department && (
                <div className="invalid-feedback">{errors.department}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                className={`form-control ${
                  touched.dob && errors.dob ? "is-invalid" : ""
                }`}
                value={employee.dob}
                onChange={handleChange}
                max={todayISO()}
              />
              {touched.dob && errors.dob && (
                <div className="invalid-feedback">{errors.dob}</div>
              )}
            </div>

            <div className="col-md-6 mb-2">
              <label>Employment Status *</label>
              <select
                name="employmentStatus"
                className={`form-select ${
                  touched.employmentStatus && errors.employmentStatus
                    ? "is-invalid"
                    : ""
                }`}
                value={employee.employmentStatus}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
              {touched.employmentStatus && errors.employmentStatus && (
                <div className="invalid-feedback">{errors.employmentStatus}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${
                  touched.email && errors.email ? "is-invalid" : ""
                }`}
                value={employee.email}
                onChange={handleChange}
              />
              {touched.email && errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="col-md-6 mb-2">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                className={`form-control ${
                  touched.startDate && errors.startDate ? "is-invalid" : ""
                }`}
                value={employee.startDate}
                onChange={handleChange}
              />
              {touched.startDate && errors.startDate && (
                <div className="invalid-feedback">{errors.startDate}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              className="form-control"
              value={employee.jobTitle}
              onChange={handleChange}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={!isFormValid}
            >
              {editingId ? "Update Employee" : "Add Employee"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingId(null);
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
                  setTouched({});
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <hr className="my-4" />

        <h4 className="text-center">Employee List</h4>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <table className="table table-bordered text-center mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Location</th>
                <th>Dept</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.length ? (
                employees.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.firstName} {e.lastName}</td>
                    <td>{e.empCode}</td>
                    <td>{e.location}</td>
                    <td>{e.department}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEdit(e)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Employees Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
