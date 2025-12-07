import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"; // ✅ type-only import

// 1. Define the shape of the user
interface User {
  name: string;
  role: string;
  email: string;
}

// 2. Define the shape of the context value
interface UserContextType {
  user: User;
}

// 3. Create the context with a temporary default value
const UserContext = createContext<UserContextType | null>(null);

// 4. Type the provider props
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user] = useState<User>({
    name: "Coco Martin",
    role: "Student",
    email: "lovejoyhope@gmail.com",
  });

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

// 5. Hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside a UserProvider");
  }
  return context;
}
