import MarkedCompany from "@/types/MarkedCompany";
import MarkedTransaction from "@/types/MarkedTransaction";
import { Transaction } from "@prisma/client";

export interface CompanyRowProps {
  markedCompanies: MarkedCompany[];
}

export default function CompanyRow(props: CompanyRowProps) {
  const { markedCompanies } = props;
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-10">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Marked Company Name
            </th>
            <th scope="col" className="px-6 py-3">
              Total Spending
            </th>
            <th scope="col" className="px-6 py-3">
              {"Percentage Spending (%)"}
            </th>
          </tr>
        </thead>
        <tbody>
          {markedCompanies.map((markedCompany, index) => (
            <tr
              key={index}
              className={
                "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {markedCompany.merchant_name}
              </th>
              <td className="px-6 py-4">{markedCompany.totalAmount}</td>
              <td className="px-6 py-4">{markedCompany.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
