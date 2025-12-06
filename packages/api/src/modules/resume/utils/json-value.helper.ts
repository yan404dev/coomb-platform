import { Prisma } from "@prisma/client";

export function toJsonValue<T extends Record<string, any>>(
  value: T[]
): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export function fromJsonValue<T extends Record<string, any>>(
  value: Prisma.JsonValue
): T[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value as T[];
}

