import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/user/User";

export interface State {
  history: HistoryItem[];
  currentUser: User;
  registeredUsername: string;
  isLoggedIn: boolean;
  historyCount: number;
}
