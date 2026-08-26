import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import SearchEmployee from "../components/SearchEmployee";

// Mock employeeSlice
vi.mock("../features/employees/employeeSlice", () => ({
  fetchEmployeeById: vi.fn(),
}));

import { fetchEmployeeById } from "../features/employees/employeeSlice";

const createTestStore = () => {
  return configureStore({
    reducer: {
      employees: (
        state = {
          employees: [],
          loading: false,
          error: null,
        }
      ) => state,
    },
  });
};

const renderSearchEmployee = (props = {}) => {
  const defaultProps = {
    setSelectedEmployee: vi.fn(),
  };

  return render(
    <Provider store={createTestStore()}>
      <SearchEmployee {...defaultProps} {...props} />
    </Provider>
  );
};

describe("SearchEmployee", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search form", () => {
    renderSearchEmployee();

    expect(
      screen.getByText("Search Employee by ID")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter Employee ID")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Search" })
    ).toBeInTheDocument();
  });

  it("shows an error when employee ID is empty", async () => {
    const setSelectedEmployee = vi.fn();

    renderSearchEmployee({ setSelectedEmployee });

    fireEvent.click(
      screen.getByRole("button", { name: "Search" })
    );

    expect(
      await screen.findByText("Please enter an employee ID.")
    ).toBeInTheDocument();

    expect(setSelectedEmployee).toHaveBeenCalledWith(null);
    expect(fetchEmployeeById).not.toHaveBeenCalled();
  });

  it("clears the error when the user starts typing", async () => {
    renderSearchEmployee();

    fireEvent.click(
      screen.getByRole("button", { name: "Search" })
    );

    expect(
      await screen.findByText("Please enter an employee ID.")
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText("Enter Employee ID"),
      {
        target: { value: "1" },
      }
    );

    expect(
      screen.queryByText("Please enter an employee ID.")
    ).not.toBeInTheDocument();
  });

  it("searches for an employee successfully", async () => {
    const employee = {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
    };

    const unwrap = vi.fn().mockResolvedValue(employee);

    fetchEmployeeById.mockReturnValue({
      type: "employees/fetchEmployeeById",
    });

    const store = createTestStore();

    store.dispatch = vi.fn().mockReturnValue({
      unwrap,
    });

    const setSelectedEmployee = vi.fn();

    render(
      <Provider store={store}>
        <SearchEmployee
          setSelectedEmployee={setSelectedEmployee}
        />
      </Provider>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Employee ID"),
      {
        target: { value: "1" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Search" })
    );

    await waitFor(() => {
      expect(fetchEmployeeById).toHaveBeenCalledWith("1");
    });

    await waitFor(() => {
      expect(setSelectedEmployee).toHaveBeenCalledWith(employee);
    });

    expect(unwrap).toHaveBeenCalled();
  });

  it("trims spaces from the employee ID before searching", async () => {
    const employee = {
      id: "123",
      name: "Rahul Sharma",
    };

    const unwrap = vi.fn().mockResolvedValue(employee);

    fetchEmployeeById.mockReturnValue({
      type: "employees/fetchEmployeeById",
    });

    const store = createTestStore();

    store.dispatch = vi.fn().mockReturnValue({
      unwrap,
    });

    render(
      <Provider store={store}>
        <SearchEmployee setSelectedEmployee={vi.fn()} />
      </Provider>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Employee ID"),
      {
        target: { value: "  123  " },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Search" })
    );

    await waitFor(() => {
      expect(fetchEmployeeById).toHaveBeenCalledWith("123");
    });
  });

  it("shows an error when employee search fails", async () => {
    const unwrap = vi.fn().mockRejectedValue(
      "No employee found."
    );

    fetchEmployeeById.mockReturnValue({
      type: "employees/fetchEmployeeById",
    });

    const store = createTestStore();

    store.dispatch = vi.fn().mockReturnValue({
      unwrap,
    });

    render(
      <Provider store={store}>
        <SearchEmployee setSelectedEmployee={vi.fn()} />
      </Provider>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Employee ID"),
      {
        target: { value: "999" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Search" })
    );

    expect(
      await screen.findByText("No employee found.")
    ).toBeInTheDocument();
  });

  it("shows a default error when search fails without an error message", async () => {
    const unwrap = vi.fn().mockRejectedValue("");

    fetchEmployeeById.mockReturnValue({
      type: "employees/fetchEmployeeById",
    });

    const store = createTestStore();

    store.dispatch = vi.fn().mockReturnValue({
      unwrap,
    });

    render(
      <Provider store={store}>
        <SearchEmployee setSelectedEmployee={vi.fn()} />
      </Provider>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Employee ID"),
      {
        target: { value: "999" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Search" })
    );

    expect(
      await screen.findByText(
        "No employee found with ID 999."
      )
    ).toBeInTheDocument();
  });
});