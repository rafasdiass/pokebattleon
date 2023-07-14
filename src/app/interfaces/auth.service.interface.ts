import { User } from '../models/user.model'; 

export interface IAuthService {
 
  login(email: string, password: string): Promise<firebase.default.auth.UserCredential>;
  signOut(): Promise<void>;
  getUser(): Promise<User | null>;
}
