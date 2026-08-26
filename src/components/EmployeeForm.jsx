import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addEmployeeAsync,
  updateEmployeeAsync,
} from "../features/employees/employeeSlice";

import { fetchCountries } from "../features/countries/countrySlice";

const initialFormData = {
  name: "",
  email: "",
  mobile: "",
  country: "",
  state: "",
  district: "",
};

function EmployeeForm({ editingEmployee, setEditingEmployee }) {
  const dispatch = useDispatch();

  const { countries = [], loading: countriesLoading } = useSelector(
    (state) => state.countries
  );

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name || "",
        email: editingEmployee.email || "",
        mobile: editingEmployee.mobile || "",
        country: editingEmployee.country || "",
        state: editingEmployee.state || "",
        district: editingEmployee.district || "",
      });
    } else {
      setFormData(initialFormData);
    }

    setErrors({});
  }, [editingEmployee]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (formData.email.trim().length > 100) {
      newErrors.email = "Email cannot exceed 100 characters.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile =
        "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required.";
    }

    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingEmployee) {
        await dispatch(
          updateEmployeeAsync({
            ...formData,
            id: editingEmployee.id,
          })
        ).unwrap();

        setEditingEmployee(null);
      } else {
        await dispatch(
          addEmployeeAsync({
            ...formData,
          })
        ).unwrap();
      }

      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      alert(error || "Something went wrong. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingEmployee(null);
  };

  return (
    <div className="form-container">
      <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name *</label>

          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter employee name"
          />

          {errors.name && (
            <p className="error-message">{errors.name}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>

          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter employee email"
          />

          {errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile *</label>

          <input
            id="mobile"
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
          />

          {errors.mobile && (
            <p className="error-message">{errors.mobile}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country *</label>

          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">
              {countriesLoading
                ? "Loading countries..."
                : "Select Country"}
            </option>

            {countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>

          {errors.country && (
            <p className="error-message">{errors.country}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="state">State *</label>

          <input
            id="state"
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
          />

          {errors.state && (
            <p className="error-message">{errors.state}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="district">District *</label>

          <input
            id="district"
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Enter district"
          />

          {errors.district && (
            <p className="error-message">{errors.district}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          {editingEmployee ? "Update Employee" : "Add Employee"}
        </button>

        {editingEmployee && (
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default EmployeeForm;
