declare namespace Express {
  export interface Request {
    user?: { id: string; username: string }; // Pridaj user property do Request
  }
}
