import { Frequency } from "../enum/frequency.enum";

export interface ITask {
  id: number;
  checked: boolean;
  frequency: Frequency;
  frequencyDays: Array<string>;
  date: string;
  occurrences: number;
  rule: string;
  penalty: number;
  total: number;
}
