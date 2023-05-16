import MarkedTransaction from "./MarkedTransaction";

export default interface ViewTransactionsOutput {
  markedTransactions: MarkedTransaction[];
  totalTransactionsCount: number;
  totalTransactionsAmount: number;
}
