import { User } from "../models/user/User";

export interface State {
  currentUser: User;
  registeredUsername: string;
  isLoggedIn: boolean;
}
