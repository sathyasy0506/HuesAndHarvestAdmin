import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ENDPOINTS } from "../config/api";
import { showToast } from "../components/Common/Toaster";

const LS = {
  ACCESS: "hh_access_token",
  ACCESS_EXP: "hh_access_expires_at",
  REFRESH: "hh_refresh_token",
  REFRESH_EXP: "hh_refresh_expires_at",
  USER: "hh_user",
};

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [refreshExpiresAt, setRefreshExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshTimerRef = useRef(null);

  const saveSession = (session) => {
    const {
      user_id,
      role,
      access_token,
      access_expires_at,
      refresh_token,
      refresh_expires_at,
    } = session;

    const userObj = { id: user_id, role };
    setUser(userObj);
    setAccessToken(access_token);
    setExpiresAt(access_expires_at);
    setRefreshToken(refresh_token);
    setRefreshExpiresAt(refresh_expires_at);

    localStorage.setItem(LS.USER, JSON.stringify(userObj));
    localStorage.setItem(LS.ACCESS, access_token);
    localStorage.setItem(LS.ACCESS_EXP, String(access_expires_at));
    localStorage.setItem(LS.REFRESH, refresh_token);
    localStorage.setItem(LS.REFRESH_EXP, String(refresh_expires_at));

    scheduleRefresh(access_expires_at);
  };

  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setExpiresAt(null);
    setRefreshToken(null);
    setRefreshExpiresAt(null);

    localStorage.removeItem(LS.USER);
    localStorage.removeItem(LS.ACCESS);
    localStorage.removeItem(LS.ACCESS_EXP);
    localStorage.removeItem(LS.REFRESH);
    localStorage.removeItem(LS.REFRESH_EXP);

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const scheduleRefresh = (expUnix) => {
    if (!expUnix) return;

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const now = Math.floor(Date.now() / 1000);
    let delaySec = expUnix - now - 40;

    if (delaySec < 5) delaySec = 5;

    refreshTimerRef.current = setTimeout(async () => {
      const ok = await refresh();
      if (!ok) {
        showToast("Session expired. Please log in again.", "error");
        await signOut();
      }
    }, delaySec * 1000);
  };

  const signIn = async (email, password) => {
    const res = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.status !== "success") {
      const msg = data?.message || "Login failed";
      showToast(msg.replace(/_/g, " "), "error");
      return { error: new Error(msg) };
    }

    saveSession(data);
    showToast("Logged in successfully", "success");

    return { error: null };
  };

  const validate = async () => {
    if (!accessToken) return false;

    const res = await fetch(ENDPOINTS.VALIDATE, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    return res.ok && data.status === "success";
  };

  const refresh = async () => {
    const storedRefresh = localStorage.getItem(LS.REFRESH);
    const storedRefreshExp = Number(localStorage.getItem(LS.REFRESH_EXP)) || 0;
    const now = Math.floor(Date.now() / 1000);

    if (!storedRefresh || now > storedRefreshExp) {
      return false;
    }

    const res = await fetch(ENDPOINTS.REFRESH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: storedRefresh }),
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.status !== "success") {
      return false;
    }

    saveSession(data); // ✅ new refresh token saved here
    return true;
  };

  const signOut = async () => {
    try {
      if (accessToken) {
        await fetch(ENDPOINTS.LOGOUT, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: "include",
        });
      }
    } catch {
      // ignore
    } finally {
      clearSession();
      showToast("Logged out", "success");
    }
  };

  const authFetch = async (url, options = {}) => {
    const opts = { ...options, headers: { ...(options.headers || {}) } };
    let token = accessToken || localStorage.getItem(LS.ACCESS);

    if (token) {
      opts.headers.Authorization = `Bearer ${token}`;
    }

    let res = await fetch(url, opts);

    if (res.status === 401) {
      const ok = await refresh();
      if (!ok) return res;

      token = localStorage.getItem(LS.ACCESS);
      opts.headers.Authorization = `Bearer ${token}`;
      res = await fetch(url, opts);
    }

    return res;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const storedAccess = localStorage.getItem(LS.ACCESS);
        const storedAccessExp = Number(
          localStorage.getItem(LS.ACCESS_EXP) || 0
        );
        const storedRefresh = localStorage.getItem(LS.REFRESH);
        const storedRefreshExp = Number(
          localStorage.getItem(LS.REFRESH_EXP) || 0
        );
        const storedUserStr = localStorage.getItem(LS.USER);

        const now = Math.floor(Date.now() / 1000);

        if (storedRefresh && now < storedRefreshExp) {
          setRefreshToken(storedRefresh);
          setRefreshExpiresAt(storedRefreshExp);

          const ok = await refresh();
          if (ok) {
            setLoading(false);
            return;
          }
        }

        if (storedAccess && now < storedAccessExp && storedUserStr) {
          const us = JSON.parse(storedUserStr);
          setUser(us);
          setAccessToken(storedAccess);
          setExpiresAt(storedAccessExp);
          scheduleRefresh(storedAccessExp);
          setLoading(false);
          return;
        }

        clearSession();
        setLoading(false);
      } catch {
        clearSession();
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS.REFRESH) {
        setRefreshToken(e.newValue);
      }
      if (e.key === LS.ACCESS) {
        setAccessToken(e.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      expiresAt,
      refreshToken,
      refreshExpiresAt,
      loading,
      signIn,
      signOut,
      validate,
      refresh,
      authFetch,
    }),
    [user, accessToken, expiresAt, refreshToken, refreshExpiresAt, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
