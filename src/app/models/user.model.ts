export class User {
  constructor(
    public uid: string,
    public email: string,
    public displayName: string = ''
  ) {}

  toFirestore(): any {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName
    };
  }
}