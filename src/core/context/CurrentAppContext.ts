import type { IAppView } from "@appTypes/IApp";
import { createContext, useContext } from "react";

export interface ICurrentAppContext {
  app_id: string;
  app: IAppView | undefined;
  loading: boolean;
  /** Re-fetches the app (e.g. after generating a license). */
  refresh: () => Promise<void>;
}

export const CurrentAppContext = createContext<ICurrentAppContext | null>(null);

/** The app currently open in the workspace (`/apps/:app_id/...`). */
export const useCurrentApp = () => {
  const ctx = useContext(CurrentAppContext);
  if (!ctx) {
    throw new Error("useCurrentApp must be used inside the app workspace layout");
  }
  return ctx;
};
