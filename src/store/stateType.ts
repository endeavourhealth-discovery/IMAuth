import { Models } from "im-library";

export interface State {
  currentUser: Models.User;
  registeredUsername: string;
  isLoggedIn: boolean;
}
