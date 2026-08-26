import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEmployees,
  deleteEmployeeAsync,
  clearEmployees,
} from "../features/employees/employeeSlice";
import DeleteDialog from "./DeleteDialog";

function EmployeeList({ setEditingEmployee, setSelectedEmployee }) {
  const dispatch = useDispatch();

  const { employees, loading, error } = useSelector(
    (state) => state.employees
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const employeesPerPage = 5;

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    return (
      employee.name.toLowerCase().includes(search) ||
      employee.email.toLowerCase().includes(search) ||
      employee.mobile.toLowerCase().includes(search) ||
      employee.country.toLowerCase().includes(search) ||
      employee.state.toLowerCase().includes(search) ||
      employee.district.toLowerCase().includes(search)
    );
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const firstValue = String(a[sortBy] || "").toLowerCase();
    const secondValue = String(b[sortBy] || "").toLowerCase();

    if (firstValue < secondValue) {
      return sortOrder === "asc" ? -1 : 1;
    }

    if (firstValue > secondValue) {
      return sortOrder === "asc" ? 1 : -1;
    }

    return 0;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedEmployees.length / employeesPerPage)
  );

  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * employeesPerPage;

  const currentEmployees = sortedEmployees.slice(
    startIndex,
    startIndex + employeesPerPage
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const handleOpenDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (loading) return;

    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(
        deleteEmployeeAsync(employeeToDelete.id)
      ).unwrap();

      if (currentEmployees.length === 1 && validCurrentPage > 1) {
        setCurrentPage(validCurrentPage - 1);
      }

      setSelectedEmployee(null);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      alert(error || "Failed to delete employee.");
    }
  };

  const handleOpenClearDialog = () => {
    setClearDialogOpen(true);
  };

  const handleCloseClearDialog = () => {
    if (loading) return;

    setClearDialogOpen(false);
  };

  const handleConfirmClearAll = () => {
    dispatch(clearEmployees());

    setSelectedEmployee(null);
    setCurrentPage(1);
    setClearDialogOpen(false);
  };

  const handleExportCSV = () => {
    if (employees.length === 0) {
      alert("No employees available to export.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Mobile",
      "Country",
      "State",
      "District",
    ];

    const rows = employees.map((employee) => [
      employee.name,
      employee.email,
      employee.mobile,
      employee.country,
      employee.state,
      employee.district,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "employees.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (loading && employees.length === 0) {
    return (
      <div className="list-container">
        <p>Loading employees...</p>
      </div>
    );
  }

  if (error && employees.length === 0) {
    return (
      <div className="list-container">
        <p>Error: {error}</p>

        <button onClick={() => dispatch(fetchEmployees())}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Employee List</h2>

        <div className="header-buttons">
          <button
            className="export-button"
            onClick={handleExportCSV}
          >
            Export CSV
          </button>

          {employees.length > 0 && (
            <button
              className="clear-button"
              onClick={handleOpenClearDialog}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Search employees"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="sort-container">
        <label>Sort by:</label>

        <select value={sortBy} onChange={handleSortByChange}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="mobile">Mobile</option>
          <option value="country">Country</option>
          <option value="state">State</option>
          <option value="district">District</option>
        </select>

        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending (A-Z)</option>
          <option value="desc">Descending (Z-A)</option>
        </select>
      </div>

      {employees.length === 0 ? (
        <p className="empty-message">No employees found.</p>
      ) : currentEmployees.length === 0 ? (
        <p className="empty-message">
          No matching employees found.
        </p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Country</th>
                <th>State</th>
                <th>District</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.mobile}</td>
                  <td>{employee.country}</td>
                  <td>{employee.state}</td>
                  <td>{employee.district}</td>

                  <td>
                    <button
                      className="view-button"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      View
                    </button>

                    <button
                      className="edit-button"
                      onClick={() => setEditingEmployee(employee)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleOpenDeleteDialog(employee)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={validCurrentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={
                  validCurrentPage === index + 1
                    ? "active-page"
                    : ""
                }
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              disabled={validCurrentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        employee={employeeToDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={loading}
        type="employee"
      />

      <DeleteDialog
        open={clearDialogOpen}
        employee={null}
        onClose={handleCloseClearDialog}
        onConfirm={handleConfirmClearAll}
        loading={false}
        type="clearAll"
      />
    </div>
  );
}

export default EmployeeList;