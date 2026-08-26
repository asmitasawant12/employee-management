import axios from "axios";

const API_URL = "http://localhost:3000/employees";

// GET all employees
const getEmployees = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// GET employee by ID
const getEmployeeById = async (employeeId) => {
  const response = await axios.get(`${API_URL}/${employeeId}`);
  return response.data;
};

// POST new employee
const addEmployee = async (employeeData) => {
  const response = await axios.post(API_URL, employeeData);
  return response.data;
};

// PUT update employee
const updateEmployee = async (employeeData) => {
  const response = await axios.put(
    `${API_URL}/${employeeData.id}`,
    employeeData
  );

  return response.data;
};

// DELETE employee
const deleteEmployee = async (employeeId) => {
  const response = await axios.delete(`${API_URL}/${employeeId}`);

  return response.data;
};

const employeeService = {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};

export default employeeService;