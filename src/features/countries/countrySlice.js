import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import countryService from "./countryService";

export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async (_, thunkAPI) => {
    try {
      return await countryService.getCountries();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch countries";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  countries: [],
  loading: false,
  error: null,
};

const countrySlice = createSlice({
  name: "countries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default countrySlice.reducer;