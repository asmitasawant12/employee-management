# Employee Management System

A React-based Employee Management System that allows users to manage employee records efficiently. The application supports adding, viewing, editing, deleting, searching, sorting, paginating, clearing, and exporting employee data.

## Features

* Add new employees
* View employee details
* Edit employee information
* Delete individual employees
* Clear all employee records
* Search employees by:

  * Name
  * Email
  * Mobile
  * Country
  * State
  * District
* Sort employees by:

  * Name
  * Email
  * Mobile
  * Country
  * State
  * District
* Sort in ascending and descending order
* Pagination for employee records
* Export employee data as CSV
* Delete confirmation dialog
* Clear All confirmation dialog
* Loading state handling
* Error handling with Retry functionality
* Form validation
* Redux state management
* Unit and component testing with Vitest and React Testing Library

## Technologies Used

* React
* Vite
* Redux Toolkit
* React Redux
* JavaScript
* Vitest
* React Testing Library
* HTML
* CSS

## Project Structure

```text
employee-management/
│
├── src/
│   ├── components/
│   │   ├── DeleteDialog.jsx
│   │   ├── EmployeeForm.jsx
│   │   ├── EmployeeList.jsx
│   │   └── SearchEmployee.jsx
│   │
│   ├── features/
│   │   └── employees/
│   │       └── employeeSlice.js
│   │
│   ├── tests/
│   │   ├── DeleteDialog.test.jsx
│   │   ├── EmployeeForm.test.jsx
│   │   ├── EmployeeList.test.jsx
│   │   └── SearchEmployee.test.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/asmitasawant12/employee-management.git
```

Move into the project folder:

```bash
cd employee-management
```

Install dependencies:

```bash
npm install
```

## Run the Application

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Running Tests

Run all tests:

```bash
npm run test -- --run
```

Run tests with coverage:

```bash
npm run test -- --run --coverage
```

## Test Coverage

The project includes tests for the main components:

* EmployeeForm
* EmployeeList
* DeleteDialog
* SearchEmployee

The tests cover:

* Rendering components
* User interactions
* Form validation
* Adding and editing employees
* Searching employees
* Sorting employees
* Pagination
* Deleting employees
* Delete failure handling
* Clear All functionality
* Loading states
* Error states
* Retry functionality
* CSV export

Final test result:

```text
Test Files  4 passed
Tests  76 passed
```

## How the Application Works

### Add Employee

Users can enter employee details using the employee form.

### View Employee

Users can view information about a selected employee.

### Edit Employee

Existing employee details can be updated.

### Delete Employee

A confirmation dialog is displayed before deleting an employee.

### Search

Employees can be searched using name, email, mobile number, country, state, or district.

### Sort

Employee records can be sorted by multiple fields in ascending or descending order.

### Pagination

Employee records are divided into pages when the number of employees exceeds the configured page size.

### Clear All

All employee records can be removed after confirmation.

### Export CSV

Employee data can be exported as a CSV file.

## Author

Asmita Ajinath Sawant

## GitHub Repository

https://github.com/asmitasawant12/employee-management
