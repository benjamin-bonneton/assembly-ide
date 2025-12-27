import { AssembleurProvider } from "./assembleur/assembleur.provider";

function AppWrapper({ children }: { children: React.ReactNode }) {
  return <AssembleurProvider>{children}</AssembleurProvider>;
}

export default AppWrapper;
