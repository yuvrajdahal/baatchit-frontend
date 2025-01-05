// "use client";
// import useAuthStore from "@/hooks/use-auth";
// import { useEffect } from "react";

// const DataProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { refreshUser, user, token } = useAuthStore();

//   useEffect(() => {
//     if (token && !user) {
//       refreshUser();
//     }
//   }, [user, token]);
//   return children;
// };

// export default DataProvider;
