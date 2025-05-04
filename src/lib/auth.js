import API_ROUTES from "@/constants/apiRoutes";
import { apiRequest } from "@/lib/apiRequest";

export const signUpUser = (email, password) =>
  apiRequest(
    API_ROUTES.auth.signup,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    },
    {
      successMessage: "Signup successful",
      defaultErrorMessage: "Signup failed",
    }
  );

export const loginUser = (email, password) =>
  apiRequest(
    API_ROUTES.auth.login,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    },
    {
      successMessage: "Logged in successfully",
      defaultErrorMessage: "Login failed",
    }
  );

export const logoutUser = () =>
  apiRequest(
    API_ROUTES.auth.logout,
    {
      method: "POST",
    },
    {
      successMessage: "Logged out",
      defaultErrorMessage: "Logout failed",
    }
  );
