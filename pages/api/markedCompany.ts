import MarkedCompany from "@/types/MarkedCompany";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const getCompanyStatistics = async (
  prisma: PrismaClient,
  companyName: string
): Promise<MarkedCompany> => {
  const totalAmount = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
  });
  const totalCompanyAmount = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      merchant_name: companyName,
    },
  });
  const companyPercentage =
    ((totalCompanyAmount._sum.amount ?? 0) / (totalAmount._sum.amount ?? 1)) *
    100;

  return {
    merchant_name: companyName,
    totalAmount: totalCompanyAmount._sum.amount ?? 0,
    percentage: companyPercentage,
  };
};

const addMarkedCompany = async (
  markedCompanyName: string
): Promise<MarkedCompany | null> => {
  const prisma = new PrismaClient();
  let metadata = await prisma.metadata.findFirst();
  if (!metadata) return null;
  metadata.markedCompanies.push(markedCompanyName);
  metadata = await prisma.metadata.update({
    where: {
      id: metadata.id,
    },
    data: {
      markedCompanies: metadata.markedCompanies,
    },
  });

  const markedCompanyOutput: MarkedCompany = await getCompanyStatistics(
    prisma,
    markedCompanyName
  );

  return markedCompanyOutput;
};

const removeMarkedCompany = async (
  markedCompanyName: string
): Promise<string[]> => {
  const prisma = new PrismaClient();
  let metadata = await prisma.metadata.findFirst();
  if (!metadata) return [];
  const filteredArray = metadata.markedCompanies.filter(
    (companyName) => companyName != markedCompanyName
  );
  metadata = await prisma.metadata.update({
    where: {
      id: metadata.id,
    },
    data: {
      markedCompanies: filteredArray,
    },
  });
  return filteredArray;
};

const getMarkedCompanies = async (): Promise<MarkedCompany[]> => {
  const prisma = new PrismaClient();
  let metadata = await prisma.metadata.findFirst();
  if (!metadata) return [];
  const markedCompanies = metadata.markedCompanies;
  const markedCompaniesOutput: MarkedCompany[] = [];
  for (let i = 0; i < markedCompanies.length; i++) {
    markedCompaniesOutput.push(
      await getCompanyStatistics(prisma, markedCompanies[i])
    );
  }
  return markedCompaniesOutput;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { companyName } = req.query;
  switch (req.method) {
    case "POST":
      if (companyName) {
        const markedCompany = await addMarkedCompany(companyName.toString());
        if (markedCompany) {
          res.status(200).json(markedCompany);
        } else {
          res.status(500).end();
        }
      }
      break;
    case "DELETE":
      if (companyName) {
        const result = await removeMarkedCompany(companyName.toString());
        if (result) res.status(200).end();
      } else {
        res.status(500).end();
      }
      break;
    case "GET":
      const markedCompaniesOutput = await getMarkedCompanies();
      if (markedCompaniesOutput) {
        res.status(200).json(markedCompaniesOutput);
      } else {
        res.status(500).end();
      }
      break;
  }
}
