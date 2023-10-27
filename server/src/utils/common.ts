import { PrismaClient } from "@prisma/client";

export const getSettings = (prisma: PrismaClient) => {
  const settings = prisma.kurobaseSettings.findFirst({
    where: {
      id: 1,
    },
  });

  if (!settings) {
    const defaultSettings = prisma.kurobaseSettings.create({
      data: {
        id: 1,
        allowUserToCreateBots: true,
        allowUserToRegister: false,
        noOfBotsPerUser: 10,
      },
    });

    return defaultSettings;
  }

  return settings;
};
