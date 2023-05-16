export default interface MarkedTransaction {
  id: number;
  amount: number;
  category: string[];
  date: string;
  merchant_name: string;
  marked: boolean;
}
