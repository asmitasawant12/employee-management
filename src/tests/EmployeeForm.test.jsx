import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import EmployeeForm from "../components/EmployeeForm";
import employeeReducer from "../features/employees/employeeSlice";
import countryReducer from "../features/countries/countrySlice";

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

vi.mock("../features/employees/employeeSlice", async () => {
  const actual = await vi.importActual(
    "../features/employees/employeeSlice"
  );

  return {
    ...actual,
    addEmployeeAsync: vi.fn((employee) => ({
      type: "employees/addEmployeeAsync",
      payload: employee,
    })),
    updateEmployeeAsync: vi.fn((employee) => ({
      type: "employees/updateEmployeeAsync",
      payload: employee,
    })),
  };
});

vi.mock("../features/countries/countrySlice", async () => {
  const actual = await vi.importActual(
    "../features/countries/countrySlice"
  );

  return {
    ...actual,
    fetchCountries: vi.fn(() => ({
      type: "countries/fetchCountries",
    })),
  };
});

import {
  addEmployeeAsync,
  updateEmployeeAsync,
} from "../features/employees/employeeSlice";

import { fetchCountries } from "../features/countries/countrySlice";

const countries = [
  {
    id: 1,
    name: "India",
  },
  {
    id: 2,
    name: "United States",
  },
  {
    id: 3,
    name: "United Kingdom",
  },
];

const editingEmployee = {
  id: "1",
  name: "Rahul Sharma",
  email: "rahul@gmail.com",
  mobile: "9876543210",
  country: "India",
  state: "Maharashtra",
  district: "Pune",
};

const createTestStore = ({
  countriesData = countries,
  countriesLoading = false,
} = {}) =>
  configureStore({
    reducer: {
      employees: employeeReducer,
      countries: countryReducer,
    },
    preloadedState: {
      employees: {
        employees: [],
        loading: false,
        error: null,
      },
      countries: {
        countries: countriesData,
        loading: countriesLoading,
        error: null,
      },
    },
  });

const renderEmployeeForm = ({
  editingEmployeeData = null,
  setEditingEmployee = vi.fn(),
  countriesData = countries,
  countriesLoading = false,
} = {}) => {
  const store = createTestStore({
    countriesData,
    countriesLoading,
  });

  render(
    <Provider store={store}>
      <EmployeeForm
        editingEmployee={editingEmployeeData}
        setEditingEmployee={setEditingEmployee}
      />
    </Provider>
  );

  return {
    store,
    setEditingEmployee,
  };
};

const fillValidForm = () => {
  fireEvent.change(
    screen.getByPlaceholderText("Enter employee name"),
    {
      target: {
        value: "Amit Patil",
      },
    }
  );

  fireEvent.change(
    screen.getByPlaceholderText("Enter employee email"),
    {
      target: {
        value: "amit@gmail.com",
      },
    }
  );

  fireEvent.change(
    screen.getByPlaceholderText("Enter 10-digit mobile number"),
    {
      target: {
        value: "9876543211",
      },
    }
  );

  fireEvent.change(screen.getByLabelText("Country *"), {
    target: {
      value: "India",
    },
  });

  fireEvent.change(
    screen.getByPlaceholderText("Enter state"),
    {
      target: {
        value: "Maharashtra",
      },
    }
  );

  fireEvent.change(
    screen.getByPlaceholderText("Enter district"),
    {
      target: {
        value: "Mumbai",
      },
    }
  );
};

describe("EmployeeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUnwrap.mockResolvedValue({});

    mockDispatch.mockImplementation((action) => ({
      ...action,
      unwrap: mockUnwrap,
    }));

    global.alert = vi.fn();
  });

  it("renders Add Employee heading", () => {
    renderEmployeeForm();

    expect(
      screen.getByRole("heading", {
        name: "Add Employee",
      })
    ).toBeInTheDocument();
  });

  it("fetches countries when component mounts", () => {
    renderEmployeeForm();

    expect(fetchCountries).toHaveBeenCalled();
  });

  it("renders all form fields", () => {
    renderEmployeeForm();

    expect(
      screen.getByPlaceholderText("Enter employee name")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter employee email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Enter 10-digit mobile number"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Country *")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter state")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter district")
    ).toBeInTheDocument();
  });

  it("renders countries in the country dropdown", () => {
    renderEmployeeForm();

    expect(
      screen.getByRole("option", {
        name: "India",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "United States",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "United Kingdom",
      })
    ).toBeInTheDocument();
  });

  it("shows Loading countries when countries are loading", () => {
    renderEmployeeForm({
      countriesLoading: true,
    });

    expect(
      screen.getByRole("option", {
        name: "Loading countries...",
      })
    ).toBeInTheDocument();
  });

  it("shows Select Country when countries are not loading", () => {
    renderEmployeeForm({
      countriesLoading: false,
    });

    expect(
      screen.getByRole("option", {
        name: "Select Country",
      })
    ).toBeInTheDocument();
  });

  it("shows required validation errors when empty form is submitted", () => {
    renderEmployeeForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByText("Name is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Email is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Mobile number is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Country is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("State is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("District is required.")
    ).toBeInTheDocument();
  });

  it("shows error when name contains fewer than 2 characters", () => {
    renderEmployeeForm();

    fireEvent.change(
      screen.getByPlaceholderText("Enter employee name"),
      {
        target: {
          value: "A",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByText(
        "Name must contain at least 2 characters."
      )
    ).toBeInTheDocument();
  });

  it("shows error when name exceeds 50 characters", () => {
    renderEmployeeForm();

    fireEvent.change(
      screen.getByPlaceholderText("Enter employee name"),
      {
        target: {
          value: "A".repeat(51),
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByText(
        "Name cannot exceed 50 characters."
      )
    ).toBeInTheDocument();
  });

  it("shows error when email exceeds 100 characters", () => {
    renderEmployeeForm();

    const longEmail = `${"a".repeat(95)}@test.com`;

    fireEvent.change(
      screen.getByPlaceholderText("Enter employee email"),
      {
        target: {
          value: longEmail,
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByText(
        "Email cannot exceed 100 characters."
      )
    ).toBeInTheDocument();
  });

  it("shows error for invalid email", () => {
    renderEmployeeForm();

    fireEvent.change(
      screen.getByPlaceholderText("Enter employee email"),
      {
        target: {
          value: "invalid-email",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByText(
        "Please enter a valid email address."
      )
    ).toBeInTheDocument();
  });

  it("shows error for invalid mobile number", () => {
    renderEmployeeForm();

    fireEvent.change(
      screen.getByPlaceholderText(
        "Enter 10-digit mobile number"
      ),
      {
        target: {
          value: "12345",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByText(
        "Please enter a valid 10-digit mobile number."
      )
    ).toBeInTheDocument();
  });

  it("clears a field error when the user changes that field", () => {
    renderEmployeeForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    expect(
      screen.getByText("Name is required.")
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText("Enter employee name"),
      {
        target: {
          value: "Amit",
        },
      }
    );

    expect(
      screen.queryByText("Name is required.")
    ).not.toBeInTheDocument();
  });

  it("successfully adds an employee with valid data", async () => {
    renderEmployeeForm();

    fillValidForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    await waitFor(() => {
      expect(addEmployeeAsync).toHaveBeenCalledWith({
        name: "Amit Patil",
        email: "amit@gmail.com",
        mobile: "9876543211",
        country: "India",
        state: "Maharashtra",
        district: "Mumbai",
      });
    });

    expect(mockUnwrap).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter employee name")
      ).toHaveValue("");

      expect(
        screen.getByPlaceholderText("Enter employee email")
      ).toHaveValue("");

      expect(
        screen.getByPlaceholderText(
          "Enter 10-digit mobile number"
        )
      ).toHaveValue("");
    });
  });

  it("shows alert when adding an employee fails", async () => {
    mockUnwrap.mockRejectedValueOnce(
      "Failed to add employee"
    );

    renderEmployeeForm();

    fillValidForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Failed to add employee"
      );
    });
  });

  it("shows default alert message when adding fails without an error message", async () => {
    mockUnwrap.mockRejectedValueOnce(null);

    renderEmployeeForm();

    fillValidForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Employee",
      })
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Something went wrong. Please try again."
      );
    });
  });

  it("renders Edit Employee heading when editing an employee", () => {
    renderEmployeeForm({
      editingEmployeeData: editingEmployee,
    });

    expect(
      screen.getByRole("heading", {
        name: "Edit Employee",
      })
    ).toBeInTheDocument();
  });

  it("fills form data when editing an employee", () => {
    renderEmployeeForm({
      editingEmployeeData: editingEmployee,
    });

    expect(
      screen.getByPlaceholderText("Enter employee name")
    ).toHaveValue("Rahul Sharma");

    expect(
      screen.getByPlaceholderText("Enter employee email")
    ).toHaveValue("rahul@gmail.com");

    expect(
      screen.getByPlaceholderText(
        "Enter 10-digit mobile number"
      )
    ).toHaveValue("9876543210");

    expect(
      screen.getByLabelText("Country *")
    ).toHaveValue("India");

    expect(
      screen.getByPlaceholderText("Enter state")
    ).toHaveValue("Maharashtra");

    expect(
      screen.getByPlaceholderText("Enter district")
    ).toHaveValue("Pune");
  });

  it("handles missing editing employee field values", () => {
    renderEmployeeForm({
      editingEmployeeData: {
        id: "2",
      },
    });

    expect(
      screen.getByPlaceholderText("Enter employee name")
    ).toHaveValue("");

    expect(
      screen.getByPlaceholderText("Enter employee email")
    ).toHaveValue("");

    expect(
      screen.getByPlaceholderText(
        "Enter 10-digit mobile number"
      )
    ).toHaveValue("");

    expect(
      screen.getByLabelText("Country *")
    ).toHaveValue("");

    expect(
      screen.getByPlaceholderText("Enter state")
    ).toHaveValue("");

    expect(
      screen.getByPlaceholderText("Enter district")
    ).toHaveValue("");
  });

  it("successfully updates an employee", async () => {
    const setEditingEmployee = vi.fn();

    renderEmployeeForm({
      editingEmployeeData: editingEmployee,
      setEditingEmployee,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Enter employee name"),
      {
        target: {
          value: "Rahul Updated",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Employee",
      })
    );

    await waitFor(() => {
      expect(updateEmployeeAsync).toHaveBeenCalledWith({
        id: "1",
        name: "Rahul Updated",
        email: "rahul@gmail.com",
        mobile: "9876543210",
        country: "India",
        state: "Maharashtra",
        district: "Pune",
      });
    });

    expect(mockUnwrap).toHaveBeenCalled();

    await waitFor(() => {
      expect(setEditingEmployee).toHaveBeenCalledWith(null);
    });
  });

  it("shows Cancel button while editing", () => {
    renderEmployeeForm({
      editingEmployeeData: editingEmployee,
    });

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      })
    ).toBeInTheDocument();
  });

  it("cancels editing and resets the form", () => {
    const setEditingEmployee = vi.fn();

    renderEmployeeForm({
      editingEmployeeData: editingEmployee,
      setEditingEmployee,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    );

    expect(setEditingEmployee).toHaveBeenCalledWith(null);

    expect(
      screen.getByPlaceholderText("Enter employee name")
    ).toHaveValue("");

    expect(
      screen.getByPlaceholderText("Enter employee email")
    ).toHaveValue("");

    expect(
      screen.getByPlaceholderText(
        "Enter 10-digit mobile number"
      )
    ).toHaveValue("");
  });
});
