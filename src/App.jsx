import { useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import SearchEmployee from "./components/SearchEmployee";

function App() {
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div className="app">
      <h1>Employee Management System</h1>
      <p className="app-description">
        Employee management application
      </p>

      <SearchEmployee
        setSelectedEmployee={setSelectedEmployee}
      />

      <EmployeeForm
        editingEmployee={editingEmployee}
        setEditingEmployee={setEditingEmployee}
      />

      <hr />

      <EmployeeList
        setEditingEmployee={setEditingEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />

      {selectedEmployee && (
        <div className="details-container">
          <div className="details-header">
            <h2>Employee Details</h2>

            <button
              className="close-button"
              onClick={() => setSelectedEmployee(null)}
            >
              Close
            </button>
          </div>

          <p>
            <strong>ID:</strong> {selectedEmployee.id}
          </p>

          <p>
            <strong>Name:</strong> {selectedEmployee.name}
          </p>

          <p>
            <strong>Email:</strong> {selectedEmployee.email}
          </p>

          <p>
            <strong>Mobile:</strong> {selectedEmployee.mobile}
          </p>

          <p>
            <strong>Country:</strong> {selectedEmployee.country}
          </p>

          <p>
            <strong>State:</strong> {selectedEmployee.state}
          </p>

          <p>
            <strong>District:</strong> {selectedEmployee.district}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;