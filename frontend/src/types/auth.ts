export type UserRole = 'ADMIN' | 'ORGANIZER' | 'BIDDER';

export interface User {
  id: string | number;
  username: string;
  role: UserRole;
}
