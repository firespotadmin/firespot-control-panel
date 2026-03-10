import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getUnreadCount } from "@/services/support-service.service";

type SupportUnreadContextValue = {
  count: number;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

const SupportUnreadContext = createContext<SupportUnreadContextValue | null>(null);

export function SupportUnreadProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUnreadCount();
      setCount(result);
    } catch {
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <SupportUnreadContext.Provider value={{ count, isLoading, refetch }}>
      {children}
    </SupportUnreadContext.Provider>
  );
}

export function useSupportUnreadContext() {
  return useContext(SupportUnreadContext);
}
