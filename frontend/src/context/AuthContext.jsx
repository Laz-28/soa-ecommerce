import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const token = localStorage.getItem("nexa_token");

    if (!token) {
      setInitializing(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Unable to restore authentication session:",
        error
      );

      localStorage.removeItem("nexa_token");
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }

  async function register({
    name,
    email,
    password
  }) {
    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password
      }
    );

    localStorage.setItem(
      "nexa_token",
      response.data.token
    );

    setUser(response.data.user);

    return response.data;
  }

  async function login({ email, password }) {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password
      }
    );

    localStorage.setItem(
      "nexa_token",
      response.data.token
    );

    setUser(response.data.user);

    return response.data;
  }

  function logout() {
    localStorage.removeItem("nexa_token");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout
    }),
    [user, initializing]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}