import { Request } from 'express';
import { User } from '../../users/user.entity';

export interface FirebaseUserClaims {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface AuthenticatedRequest extends Request {
  firebaseUser: FirebaseUserClaims;
  currentUser?: User;
}
