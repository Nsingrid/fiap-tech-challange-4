"use client";
import { useEffect } from "react";
import { useUserStore } from "~/stores/useUserStore";

export function SetTokenClient({ token }: { token: string }) {
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => {
    setToken(token);
  }, [token, setToken]);

  return null;
}
