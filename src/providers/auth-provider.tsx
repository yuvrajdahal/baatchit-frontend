import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DataProvider from "./data-provider";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cookie = cookies().get("token");
  if (cookie?.value === undefined) {
    redirect("/login");
  }
  return (
    <>
      <DataProvider>{children}</DataProvider>
    </>
  );
};

export default AuthProvider;
