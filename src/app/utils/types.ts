export enum Status {
  inProgress = "inProgress",
  done = "done",
  created = "created",
  backlog = "backlog",
}

export type PrefixIndex = `${Status}${"_"}${number}`;

export type Task = {
  title: string;
  id: number;
  index: PrefixIndex;
  description: string;
  status: Status;
};
