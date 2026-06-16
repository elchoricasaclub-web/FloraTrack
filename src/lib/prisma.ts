import { createRequire } from "node:module";


type PrismaDelegate = {
  findMany: (args?: unknown) => Promise<any[]>;
  findFirst: (args?: unknown) => Promise<any | null>;
  findUnique: (args?: unknown) => Promise<any | null>;
  count: (args?: unknown) => Promise<number>;
  groupBy: (args?: unknown) => Promise<any[]>;
  create: (args?: unknown) => Promise<any>;
  update: (args?: unknown) => Promise<any>;
  upsert: (args?: unknown) => Promise<any>;
  delete: (args?: unknown) => Promise<any>;
  deleteMany: (args?: unknown) => Promise<{ count: number }>;
};

type FloraPrismaClient = {
  [delegateName: string]: PrismaDelegate;
} & {
  $connect?: () => Promise<void>;
  $disconnect?: () => Promise<void>;
  $queryRawUnsafe: (query: string, ...values: unknown[]) => Promise<any[]>;
  $transaction: <T>(operations: Promise<T>[]) => Promise<T[]>;
};

type PrismaClientConstructor = new (options?: {
  log?: Array<"query" | "info" | "warn" | "error">;
}) => FloraPrismaClient;

const nodeRequire = createRequire(import.meta.url);

const globalForPrisma = globalThis as unknown as {
  prisma?: FloraPrismaClient;
};

function createPrismaError(error?: unknown) {
  const detail = error instanceof Error ? ` Detalle: ${error.message}` : "";

  return new Error(
    `Prisma Client no esta generado. Ejecuta \`npm install\` y luego \`npx prisma generate\` antes de usar rutas de base de datos.${detail}`
  );
}

function loadPrismaClientConstructor(): PrismaClientConstructor {
  try {
    const prismaModule = nodeRequire("@prisma/client") as {
      PrismaClient?: PrismaClientConstructor;
    };

    if (!prismaModule.PrismaClient) {
      throw createPrismaError();
    }

    return prismaModule.PrismaClient;
  } catch (error) {
    throw createPrismaError(error);
  }
}

function getPrismaClient(): FloraPrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const PrismaClient = loadPrismaClientConstructor();
  const client = new PrismaClient({
    log: ["error", "warn"]
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

export const prisma = new Proxy({} as FloraPrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
  set(_target, prop, value, receiver) {
    const client = getPrismaClient();
    return Reflect.set(client, prop, value, receiver);
  }
});

export { getPrismaClient };
