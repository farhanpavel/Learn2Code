"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface FetchData {
  pdfUrl: string;
  Booktype: string;
  Booktopic: string;
  date: string;
  _id: string;
  status: "0";
}
interface AppContextType {
  bookData: FetchData[];
  setbookData: Dispatch<SetStateAction<FetchData[]>>;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AdminWrapper({ children }: { children: React.ReactNode }) {
  const [bookData, setbookData] = useState<FetchData[]>([]);

  return (
    <AppContext.Provider
      value={{
        bookData,
        setbookData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppWrapper");
  }
  return context;
}
