import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchEmployeeById } from "../features/employees/employeeSlice";

function SearchEmployee({ setSelectedEmployee }) {
  const dispatch = useDispatch();

  const [employeeId, setEmployeeId] = useState("");
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    const id = employeeId.trim();

    if (!id) {
      setSearchError("Please enter an employee ID.");
      setSelectedEmployee(null);
      return;
    }

    setLoading(true);
    setSearchError("");
    setSelectedEmployee(null);

    try {
      const employee = await dispatch(fetchEmployeeById(id)).unwrap();

      setSelectedEmployee(employee);
    } catch (error) {
      setSearchError(
        error || `No employee found with ID ${id}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setEmployeeId(event.target.value);
    setSearchError("");
  };

  return (
    <div className="search-container">
      <h2>Search Employee by ID</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={employeeId}
          onChange={handleChange}
          placeholder="Enter Employee ID"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {searchError && (
        <p className="error-message">{searchError}</p>
      )}
    </div>
  );
}

export default SearchEmployee;