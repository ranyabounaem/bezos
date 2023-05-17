import CompanyRow from "@/components/CompanyRow";
import PaginatedTransactions from "@/components/PaginatedTransactions";
import MarkedCompany from "@/types/MarkedCompany";
import MarkedTransaction from "@/types/MarkedTransaction";
import ViewTransactionsOutput from "@/types/ViewTransactionsOutput";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
export default function Transactions() {
  const [pageIndex, setPageIndex] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [transactions, setTransactions] = useState<MarkedTransaction[]>([]);
  const [markedCompanies, setMarkedCompanies] = useState<MarkedCompany[]>([]);

  useEffect(() => {
    const viewMarkedTransactions = async () => {
      const res = await fetch(
        `http://localhost:3000/api/markedTransactions?page=${pageIndex}&limit=${20}`
      );
      const viewTransactionsOutput: ViewTransactionsOutput = await res.json();
      setTransactions(viewTransactionsOutput.markedTransactions);
      setTotalAmount(viewTransactionsOutput.totalTransactionsAmount);
      setTotalCount(viewTransactionsOutput.totalTransactionsCount);
    };
    viewMarkedTransactions();
  }, [pageIndex, markedCompanies]);

  useEffect(() => {
    const getMarkedCompanies = async () => {
      const res = await fetch(`http://localhost:3000/api/markedCompany`, {
        method: "GET",
      });
      const markedCompanies = await res.json();
      console.log(markedCompanies);
      setMarkedCompanies(markedCompanies);
    };
    getMarkedCompanies();
  }, []);
  return (
    <main
      className={`flex min-h-screen flex-col items-center ${inter.className}`}
    >
      <h1 className={"text-8xl mb-10"}>{"Keeping Up With The Bezos"}</h1>
      <PaginatedTransactions
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        markedCompanies={markedCompanies}
        setMarkedCompanies={setMarkedCompanies}
        limit={limit}
        totalAmount={totalAmount}
        totalCount={totalCount}
        transactions={transactions}
      />

      <CompanyRow markedCompanies={markedCompanies} />
    </main>
  );
}
