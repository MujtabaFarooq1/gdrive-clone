import API_ROUTES from "@/constants/apiRoutes";

export const signUpUser = async (email, password) => {
  const res = await fetch(API_ROUTES.auth.signup, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Sign-up failed");
  }
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(API_ROUTES.auth.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Login failed");
  }
  return res.json();
};

export const logutUser = async () => {
  const res = await fetch(API_ROUTES.auth.logout, {
    method: "POST",
    // body: {},
    // headers: {
    //   "Content-Type": "application/json",
    // },
  });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
  return res.json();
};
