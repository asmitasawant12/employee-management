import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import employeeService from "./employeeService";

// GET all employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, thunkAPI) => {
    try {
      return await employeeService.getEmployees();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch employees";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET employee by ID
export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchEmployeeById",
  async (employeeId, thunkAPI) => {
    try {
      return await employeeService.getEmployeeById(employeeId);
    } catch (error) {
      const message =
        error.response?.status === 404
          ? `No employee found with ID ${employeeId}.`
          : error.response?.data?.message ||
            error.message ||
            "Failed to fetch employee";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// POST new employee
export const addEmployeeAsync = createAsyncThunk(
  "employees/addEmployee",
  async (employeeData, thunkAPI) => {
    try {
      return await employeeService.addEmployee(employeeData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add employee";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// PUT update employee
export const updateEmployeeAsync = createAsyncThunk(
  "employees/updateEmployee",
  async (employeeData, thunkAPI) => {
    try {
      return await employeeService.updateEmployee(employeeData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update employee";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// DELETE employee
export const deleteEmployeeAsync = createAsyncThunk(
  "employees/deleteEmployee",
  async (employeeId, thunkAPI) => {
    try {
      await employeeService.deleteEmployee(employeeId);
      return employeeId;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete employee";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  employees: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,

  reducers: {
    clearEmployees: (state) => {
      state.employees = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ADD
      .addCase(addEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployeeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(addEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.employees.findIndex(
          (employee) => employee.id === action.payload.id
        );

        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.loading = false;

        state.employees = state.employees.filter(
          (employee) => employee.id !== action.payload
        );
      })
      .addCase(deleteEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployees } = employeeSlice.actions;

export default employeeSlice.reducer;