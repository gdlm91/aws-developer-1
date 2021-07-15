export interface RawChallenge {
  challengeID: number;
  students: string;
  winners: number;
}

export interface Challenge extends Omit<RawChallenge, "students"> {
  students: string[];
  winnersList?: string[];
}
