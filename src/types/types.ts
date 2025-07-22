export interface EventItem {
  id?: string;
  uid: string;
  title: string;
  date: string;
  time: string;
  importance: 'звичайна' | 'важлива' | 'критична';
}

export interface UserData {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  token?: string;
}
