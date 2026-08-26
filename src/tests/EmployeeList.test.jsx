import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import EmployeeList from "../components/EmployeeList";
import employeeReducer from "../features/employees/employeeSlice";

const mockUnwrap = vi.fn();

const mockDispatch = vi.fn((action) => ({
  ...action,
  unwrap: mockUnwrap,
}));

vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");

  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock("../components/DeleteDialog", () => ({
  default: ({
    open,
    employee,
    onClose,
    onConfirm,
    loading,
    type,
  }) => {
    if (!open) return null;

    const isClearAll = type === "clearAll";

    return (
      <div>
        <h3>
          {isClearAll ? "Clear All Employees?" : "Delete Employee?"}
        </h3>

        <p>
          {isClearAll
            ? "Are you sure you want to delete all employees? This action cannot be undone."
            : `Are you sure you want to delete ${
                employee?.name || ""
              }?`}
        </p>

        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>

        <button onClick={onConfirm} disabled={loading}>
          {isClearAll ? "Clear All" : "Delete"}
        </button>
      </div>
    );
  },
}));

vi.mock("../features/employees/employeeSlice", async () => {
  const actual = await vi.importActual(
    "../features/employees/employeeSlice"
  );

  return {
    ...actual,
    fetchEmployees: vi.fn(() => ({
      type: "employees/fetchEmployees",
    })),
    deleteEmployeeAsync: vi.fn((id) => ({
      type: "employees/deleteEmployeeAsync",
      payload: id,
    })),
    clearEmployees: vi.fn(() => ({
      type: "employees/clearEmployees",
    })),
  };
});

import {
  fetchEmployees,
  deleteEmployeeAsync,
  clearEmployees,
} from "../features/employees/employeeSlice";

const employees = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    mobile: "9876543210",
    country: "India",
    state: "Maharashtra",
    district: "Pune",
  },
  {
    id: "2",
    name: "Amit Patil",
    email: "amit@gmail.com",
    mobile: "9876543211",
    country: "India",
    state: "Maharashtra",
    district: "Mumbai",
  },
  {
    id: "3",
    name: "Sneha Kulkarni",
    email: "sneha@gmail.com",
    mobile: "9876543212",
    country: "India",
    state: "Karnataka",
    district: "Bengaluru",
  },
  {
    id: "4",
    name: "Priya Deshmukh",
    email: "priya@gmail.com",
    mobile: "9876543213",
    country: "India",
    state: "Maharashtra",
    district: "Nashik",
  },
  {
    id: "5",
    name: "Rohit Jadhav",
    email: "rohit@gmail.com",
    mobile: "9876543214",
    country: "India",
    state: "Gujarat",
    district: "Surat",
  },
  {
    id: "6",
    name: "Neha Joshi",
    email: "neha@gmail.com",
    mobile: "9876543215",
    country: "India",
    state: "Goa",
    district: "Panaji",
  },
];

const createTestStore = (
  initialEmployees = [],
  loading = false,
  error = null
) =>
  configureStore({
    reducer: {
      employees: employeeReducer,
    },
    preloadedState: {
      employees: {
        employees: initialEmployees,
        loading,
        error,
      },
    },
  });

const renderEmployeeList = ({
  employeeData = [],
  loading = false,
  error = null,
  setEditingEmployee = vi.fn(),
  setSelectedEmployee = vi.fn(),
} = {}) => {
  const store = createTestStore(employeeData, loading, error);

  render(
    <Provider store={store}>
      <EmployeeList
        setEditingEmployee={setEditingEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />
    </Provider>
  );

  return {
    store,
    setEditingEmployee,
    setSelectedEmployee,
  };
};

describe("EmployeeList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUnwrap.mockResolvedValue({});

    mockDispatch.mockImplementation((action) => ({
      ...action,
      unwrap: mockUnwrap,
    }));

    global.alert = vi.fn();

    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();

    vi.spyOn(document.body, "appendChild");
    vi.spyOn(document.body, "removeChild");
  });

  it("shows Employee List heading", () => {
    renderEmployeeList();

    expect(
      screen.getByRole("heading", {
        name: "Employee List",
      })
    ).toBeInTheDocument();
  });

  it("shows empty message when there are no employees", () => {
    renderEmployeeList();

    expect(
      screen.getByText("No employees found.")
    ).toBeInTheDocument();
  });

  it("shows loading message when employees are loading", () => {
    renderEmployeeList({
      loading: true,
    });

    expect(
      screen.getByText("Loading employees...")
    ).toBeInTheDocument();
  });

  it("shows error message and Retry button when fetching fails", () => {
    renderEmployeeList({
      error: "Failed to fetch employees",
    });

    expect(
      screen.getByText("Error: Failed to fetch employees")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Retry",
      })
    ).toBeInTheDocument();
  });

  it("fetches employees again when Retry is clicked", () => {
    renderEmployeeList({
      error: "Failed to fetch employees",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Retry",
      })
    );

    expect(fetchEmployees).toHaveBeenCalled();
  });

  it("renders employees in the table", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    expect(screen.getByText("Amit Patil")).toBeInTheDocument();
    expect(screen.getByText("Neha Joshi")).toBeInTheDocument();
    expect(screen.getByText("Priya Deshmukh")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("Rohit Jadhav")).toBeInTheDocument();

    expect(
      screen.queryByText("Sneha Kulkarni")
    ).not.toBeInTheDocument();
  });

  it("searches employees by name", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search employees"),
      {
        target: {
          value: "Rahul",
        },
      }
    );

    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();

    expect(
      screen.queryByText("Amit Patil")
    ).not.toBeInTheDocument();
  });

  it("searches employees by email", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search employees"),
      {
        target: {
          value: "sneha@gmail.com",
        },
      }
    );

    expect(
      screen.getByText("Sneha Kulkarni")
    ).toBeInTheDocument();
  });

  it("searches employees by mobile", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search employees"),
      {
        target: {
          value: "9876543213",
        },
      }
    );

    expect(
      screen.getByText("Priya Deshmukh")
    ).toBeInTheDocument();
  });

  it("searches employees by country", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search employees"),
      {
        target: {
          value: "Gujarat",
        },
      }
    );

    expect(
      screen.getByText("Rohit Jadhav")
    ).toBeInTheDocument();
  });

  it("searches employees by state", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search employees"),
      {
        target: {
          value: "Karnataka",
        },
      }
    );

    expect(
      screen.getByText("Sneha Kulkarni")
    ).toBeInTheDocument();
  });

  it("searches employees by district", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search employees"),
      {
        target: {
          value: "Panaji",
        },
      }
    );

    expect(
      screen.getByText("Neha Joshi")
    ).toBeInTheDocument();
  });

  it("shows no matching employees message", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search employees"),
      {
        target: {
          value: "XYZ Employee",
        },
      }
    );

    expect(
      screen.getByText("No matching employees found.")
    ).toBeInTheDocument();
  });

  it("calls setSelectedEmployee when View is clicked", () => {
    const setSelectedEmployee = vi.fn();

    renderEmployeeList({
      employeeData: employees,
      setSelectedEmployee,
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "View",
      })[0]
    );

    expect(setSelectedEmployee).toHaveBeenCalledWith(
      employees[1]
    );
  });

  it("calls setEditingEmployee when Edit is clicked", () => {
    const setEditingEmployee = vi.fn();

    renderEmployeeList({
      employeeData: employees,
      setEditingEmployee,
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Edit",
      })[0]
    );

    expect(setEditingEmployee).toHaveBeenCalledWith(
      employees[1]
    );
  });

  it("opens delete dialog when Delete is clicked", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete",
      })[0]
    );

    expect(
      screen.getByRole("heading", {
        name: "Delete Employee?",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Are you sure you want to delete Amit Patil?"
      )
    ).toBeInTheDocument();
  });

  it("closes delete dialog when Cancel is clicked", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete",
      })[0]
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    );

    expect(
      screen.queryByRole("heading", {
        name: "Delete Employee?",
      })
    ).not.toBeInTheDocument();
  });

  it("successfully deletes an employee when Delete is confirmed", async () => {
    const setSelectedEmployee = vi.fn();

    renderEmployeeList({
      employeeData: employees,
      setSelectedEmployee,
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete",
      })[0]
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete",
    });

    fireEvent.click(
      deleteButtons[deleteButtons.length - 1]
    );

    await waitFor(() => {
      expect(deleteEmployeeAsync).toHaveBeenCalledWith("2");
    });

    await waitFor(() => {
      expect(mockUnwrap).toHaveBeenCalled();
    });

    expect(setSelectedEmployee).toHaveBeenCalledWith(null);

    expect(
      screen.queryByRole("heading", {
        name: "Delete Employee?",
      })
    ).not.toBeInTheDocument();
  });

  it("shows an alert when employee deletion fails", async () => {
    mockUnwrap.mockRejectedValueOnce(
      "Failed to delete employee."
    );

    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete",
      })[0]
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete",
    });

    fireEvent.click(
      deleteButtons[deleteButtons.length - 1]
    );

    await waitFor(() => {
      expect(deleteEmployeeAsync).toHaveBeenCalledWith("2");
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Failed to delete employee."
      );
    });
  });

  it("opens Clear All dialog when Clear All is clicked", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear All",
      })
    );

    expect(
      screen.getByRole("heading", {
        name: "Clear All Employees?",
      })
    ).toBeInTheDocument();
  });

  it("closes Clear All dialog when Cancel is clicked", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear All",
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    );

    expect(
      screen.queryByRole("heading", {
        name: "Clear All Employees?",
      })
    ).not.toBeInTheDocument();
  });

  it("dispatches clearEmployees when Clear All is confirmed", () => {
    const setSelectedEmployee = vi.fn();

    renderEmployeeList({
      employeeData: employees,
      setSelectedEmployee,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear All",
      })
    );

    const clearAllButtons = screen.getAllByRole("button", {
      name: "Clear All",
    });

    fireEvent.click(
      clearAllButtons[clearAllButtons.length - 1]
    );

    expect(clearEmployees).toHaveBeenCalled();
    expect(setSelectedEmployee).toHaveBeenCalledWith(null);

    expect(
      screen.queryByRole("heading", {
        name: "Clear All Employees?",
      })
    ).not.toBeInTheDocument();
  });

  it("shows pagination when there are more than 5 employees", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    expect(
      screen.getByRole("button", {
        name: "Previous",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Next",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "1",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "2",
      })
    ).toBeInTheDocument();
  });

  it("moves to the next page", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next",
      })
    );

    expect(
      screen.getByText("Sneha Kulkarni")
    ).toBeInTheDocument();
  });

  it("moves back to the previous page", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next",
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Previous",
      })
    );

    expect(
      screen.getByText("Amit Patil")
    ).toBeInTheDocument();
  });

  it("moves directly to page 2", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "2",
      })
    );

    expect(
      screen.getByText("Sneha Kulkarni")
    ).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    expect(
      screen.getByRole("button", {
        name: "Previous",
      })
    ).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Next",
      })
    ).toBeDisabled();
  });

  it("changes sorting order to descending", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    const sortSelects = screen.getAllByRole("combobox");

    fireEvent.change(sortSelects[1], {
      target: {
        value: "desc",
      },
    });

    expect(
      screen.getByText("Sneha Kulkarni")
    ).toBeInTheDocument();
  });

  it("changes sort field to email", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    const sortSelects = screen.getAllByRole("combobox");

    fireEvent.change(sortSelects[0], {
      target: {
        value: "email",
      },
    });

    expect(
      screen.getByText("amit@gmail.com")
    ).toBeInTheDocument();
  });

  it("covers the greater-than sorting branch", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    const sortSelects = screen.getAllByRole("combobox");

    fireEvent.change(sortSelects[0], {
      target: {
        value: "name",
      },
    });

    fireEvent.change(sortSelects[1], {
      target: {
        value: "desc",
      },
    });

    expect(
      screen.getByText("Sneha Kulkarni")
    ).toBeInTheDocument();
  });

  it("covers sorting when two values are equal", () => {
    const employeesWithSameName = [
      {
        ...employees[0],
        id: "10",
        name: "Same Employee",
      },
      {
        ...employees[1],
        id: "11",
        name: "Same Employee",
      },
    ];

    renderEmployeeList({
      employeeData: employeesWithSameName,
    });

    expect(
      screen.getAllByText("Same Employee")
    ).toHaveLength(2);
  });

  it("renders Export CSV button when employees exist", () => {
    renderEmployeeList({
      employeeData: employees,
    });

    expect(
      screen.getByRole("button", {
        name: "Export CSV",
      })
    ).toBeInTheDocument();
  });

  it("shows Export CSV button when there are no employees", () => {
    renderEmployeeList();

    expect(
      screen.getByRole("button", {
        name: "Export CSV",
      })
    ).toBeInTheDocument();
  });

  it("shows an alert when exporting CSV with no employees", () => {
    renderEmployeeList();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export CSV",
      })
    );

    expect(global.alert).toHaveBeenCalledWith(
      "No employees available to export."
    );
  });

  it("exports employees as CSV", () => {
    const clickMock = vi.fn();

    const originalCreateElement =
      document.createElement.bind(document);

    vi.spyOn(document, "createElement").mockImplementation(
      (tagName) => {
        const element = originalCreateElement(tagName);

        if (tagName === "a") {
          element.click = clickMock;
        }

        return element;
      }
    );

    renderEmployeeList({
      employeeData: employees,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export CSV",
      })
    );

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(
      "mock-url"
    );
  });
});