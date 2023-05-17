import { writeFile } from "fs";
import { readFile } from "fs/promises";
import { Prisma, PrismaClient, Transaction } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import MarkedTransaction from "@/types/MarkedTransaction";
import ViewTransactionsOutput from "@/types/ViewTransactionsOutput";
const fetchMarkedTransactions = async (
  page: number,
  limit: number
): Promise<ViewTransactionsOutput> => {
  const prisma = new PrismaClient();

  let metadata = await prisma.metadata.findFirst();
  const oldEtag = metadata?.etag;

  console.log(`Old ETag: ${oldEtag}`);

  const res = await fetch(
    "https://hadiziady.github.io/bezos_mock_api/mock_api.json",
    {
      headers: {
        "If-None-Match": oldEtag ?? "",
      },
    }
  );
  if (res.status === 304) {
    console.log("File not modified, using cached version");

    const transactions = await prisma.transaction.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        date: "asc",
      },
    });

    const markedTransactions: MarkedTransaction[] = [];
    const markedCompanies = metadata ? metadata.markedCompanies : [];
    transactions.forEach((transaction) => {
      markedTransactions.push({
        ...transaction,
        marked: markedCompanies.includes(transaction.merchant_name),
      });
    });

    const viewTransactionsOutput: ViewTransactionsOutput = {
      markedTransactions: markedTransactions,
      totalTransactionsAmount: metadata ? metadata.totalAmount : 0,
      totalTransactionsCount: metadata ? metadata.totalCount : 0,
    };

    return viewTransactionsOutput;
  }

  console.log(
    "First time fetching file or the file has been modified" +
      " reading response then caching the file"
  );

  const transactionsCount = await prisma.transaction.count();
  console.log(`Old transactions count: ${transactionsCount}`);

  const newEtag = res.headers.get("ETag");
  console.log(`New ETag: ${newEtag}`);

  const newData: Transaction[] = await res.json();
  console.log(`New Data from API length: ${newData.length}`);

  const slicedTransactions = newData.slice(transactionsCount);
  console.log(`Sliced transactions length: ${slicedTransactions.length}`);
  await prisma.transaction.createMany({
    data: slicedTransactions,
  });

  const newTransactionsCount = await prisma.transaction.count();
  console.log(`New transactions count: ${newTransactionsCount}`);

  // If metadata is available in the database (not fetching for the first time)
  if (metadata) {
    const bezosRelatedAmount = newData
      .filter((data) => metadata?.markedCompanies.includes(data.merchant_name))
      .reduce((sum, current) => (sum = sum + current.amount), 0);
    metadata = await prisma.metadata.update({
      where: {
        id: metadata?.id,
      },
      data: {
        etag: newEtag ?? "",
        markedCompanies: metadata.markedCompanies,
        totalAmount: bezosRelatedAmount,
        totalCount: newData.length,
      },
    });
  } else {
    const defaultBezosCompanies = [
      "Amazon",
      "Washington Post",
      "Whole Foods",
      "Blue Origin",
    ];
    const bezosRelatedAmount = newData
      .filter((data) => defaultBezosCompanies.includes(data.merchant_name))
      .reduce((sum, current) => (sum = sum + current.amount), 0);
    metadata = await prisma.metadata.create({
      data: {
        id: "0",
        etag: newEtag ?? "",
        markedCompanies: defaultBezosCompanies,
        totalAmount: bezosRelatedAmount,
        totalCount: newData.length,
      },
    });
  }

  const transactions = await prisma.transaction.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      date: "asc",
    },
  });

  const markedTransactions: MarkedTransaction[] = [];
  const markedCompanies = metadata.markedCompanies;
  transactions.forEach((transaction) => {
    markedTransactions.push({
      ...transaction,
      marked: markedCompanies.includes(transaction.merchant_name),
    });
  });

  const viewTransactionsOutput: ViewTransactionsOutput = {
    markedTransactions: markedTransactions,
    totalTransactionsAmount: metadata.totalAmount,
    totalTransactionsCount: metadata.totalCount,
  };

  return viewTransactionsOutput;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page, limit } = req.query;
  const data = await fetchMarkedTransactions(
    page ? +page : 1,
    limit ? +limit : 10
  );
  res.status(200).json(data);
}
