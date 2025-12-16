import axiosInstance from "./axiosinstance";

interface User {
  _id?: string;
  name?: string;
  email?: string;
}

interface SignInResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: User;
}

interface SignUpResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export const signIn = async (
  credentials: SignInCredentials
): Promise<SignInResponse> => {
  try {
    const { email, password } = credentials;

    const response = await axiosInstance.post<SignInResponse>("/users/signin", {
      email,
      password,
    });

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || "Invalid email or password.",
        };
      } else if (error.request) {
        return {
          success: false,
          message:
            "Cannot connect to server. Please check your internet connection.",
        };
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
};

export const signUp = async (userData: SignUpData): Promise<SignUpResponse> => {
  try {
    const response = await axiosInstance.post<SignUpResponse>(
      "/users/signup",
      userData
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Sign up error:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || "Sign up failed.",
        };
      } else if (error.request) {
        return {
          success: false,
          message:
            "Cannot connect to server. Please check your internet connection.",
        };
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
};

function isAxiosError(error: unknown): error is {
  response?: { data?: { message?: string } };
  request?: unknown;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "request" in error)
  );
}
