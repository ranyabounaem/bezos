import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const addMarkedCompany = async (
  markedCompanyName: string
): Promise<string[]> => {
  const prisma = new PrismaClient();
  let metadata = await prisma.metadata.findFirst();
  if (!metadata) return [];
  metadata.markedCompanies.push(markedCompanyName);
  metadata = await prisma.metadata.update({
    where: {
      id: metadata.id,
    },
    data: {
      markedCompanies: metadata.markedCompanies,
    },
  });
  return metadata.markedCompanies;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { companyName } = req.query;
  if (companyName) {
    const markedCompanies = await addMarkedCompany(companyName.toString());
    if (markedCompanies) {
      res.status(200).json(markedCompanies);
    } else {
      res.status(500).end();
    }
  } else {
    res.status(500).end();
  }
}
