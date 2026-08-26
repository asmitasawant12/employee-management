import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../features/employees/employeeSlice";
import countryReducer from "../features/countries/countrySlice";

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    countries: countryReducer,
  },
});