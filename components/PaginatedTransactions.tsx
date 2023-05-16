import MarkedTransaction from "@/types/MarkedTransaction";
import { Transaction } from "@prisma/client";

export interface PaginatedTransactionsProps {
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  setMarkedCompanies: (markedCompanies: string[]) => void;
  limit: number;
  totalAmount: number;
  totalCount: number;
  transactions: MarkedTransaction[];
}

export default function PaginatedTransactions(
  props: PaginatedTransactionsProps
) {
  const {
    pageIndex,
    setPageIndex,
    setMarkedCompanies,
    limit,
    totalAmount,
    totalCount,
    transactions,
  } = props;

  const addCompanyName = async (companyName: string) => {
    const res = await fetch(
      `http://localhost:3000/api/addMarkedCompany?companyName=${companyName}`
    );
    setMarkedCompanies(await res.json());
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Transaction Date
            </th>
            <th scope="col" className="px-6 py-3">
              Transaction Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Transaction Percentage
            </th>
            <th scope="col" className="px-6 py-3">
              Merchant Name
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>

            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={index}
              className={
                transaction.marked
                  ? "bg-white border-b dark:bg-red-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {transaction.date}
              </th>
              <td className="px-6 py-4">{transaction.amount}</td>
              <td className="px-6 py-4">{transaction.amount / totalAmount}</td>
              <td className="px-6 py-4">{transaction.merchant_name}</td>

              <td className="px-6 py-4">
                {transaction.category.map((category, index) => (
                  <p key={index}>{category}</p>
                ))}
              </td>

              <td className="px-6 py-4">
                <button
                  disabled={transaction.marked}
                  onClick={() => {
                    addCompanyName(transaction.merchant_name);
                  }}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline disabled:text-gray-700"
                >
                  Mark as Bezos-related
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav
        className="flex items-center justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {`${limit * (pageIndex - 1) + 1}-${
              limit * (pageIndex - 1) + limit
            }`}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalCount}
          </span>
        </span>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              disabled={pageIndex <= 1}
              onClick={() => {
                setPageIndex(pageIndex - 1);
              }}
              className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </li>
          <li>
            <div className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              {pageIndex}
            </div>
          </li>
          <li>
            <button
              onClick={() => {
                setPageIndex(pageIndex + 1);
              }}
              className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}