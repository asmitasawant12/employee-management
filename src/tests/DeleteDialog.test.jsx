import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteDialog from "../components/DeleteDialog";

describe("DeleteDialog", () => {
  const defaultProps = {
    open: true,
    employee: {
      id: "1",
      name: "Rahul Sharma",
    },
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    loading: false,
    type: "employee",
  };

  it("does not render when open is false", () => {
    render(
      <DeleteDialog
        {...defaultProps}
        open={false}
      />
    );

    expect(
      screen.queryByText("Delete Employee?")
    ).not.toBeInTheDocument();
  });

  it("renders employee delete dialog when open is true", () => {
    render(
      <DeleteDialog
        {...defaultProps}
      />
    );

    expect(
      screen.getByText("Delete Employee?")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText("Rahul Sharma")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Delete",
      })
    ).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();

    render(
      <DeleteDialog
        {...defaultProps}
        onClose={onClose}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Delete is clicked", () => {
    const onConfirm = vi.fn();

    render(
      <DeleteDialog
        {...defaultProps}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows deleting state when loading is true", () => {
    render(
      <DeleteDialog
        {...defaultProps}
        loading={true}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Deleting...",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Deleting...",
      })
    ).toBeDisabled();
  });

  it("renders Clear All dialog correctly", () => {
    render(
      <DeleteDialog
        {...defaultProps}
        type="clearAll"
        employee={null}
      />
    );

    expect(
      screen.getByText("Clear All Employees?")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Are you sure you want to delete all employees/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Clear All",
      })
    ).toBeInTheDocument();
  });

  it("calls onConfirm when Clear All is clicked", () => {
    const onConfirm = vi.fn();

    render(
      <DeleteDialog
        {...defaultProps}
        type="clearAll"
        employee={null}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear All",
      })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows clearing state when Clear All is loading", () => {
    render(
      <DeleteDialog
        {...defaultProps}
        type="clearAll"
        employee={null}
        loading={true}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Clearing...",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Clearing...",
      })
    ).toBeDisabled();
  });

  it("shows employee name in the delete confirmation", () => {
    render(
      <DeleteDialog
        {...defaultProps}
        employee={{
          id: "2",
          name: "Sneha Kulkarni",
        }}
      />
    );

    expect(
      screen.getByText("Sneha Kulkarni")
    ).toBeInTheDocument();
  });
});
