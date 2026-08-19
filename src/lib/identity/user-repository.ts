import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import type { BaseRepository } from "@/lib/shared/base-repository";
import { NotFoundError } from "@/lib/shared/not-found-error";
import { UserEntity } from "./user-entity";

function toEntity(row: typeof usersTable.$inferSelect): UserEntity {
  return UserEntity.create({
    id: row.id,
    clerkUserId: row.clerkUserId,
    name: row.name,
    age: row.age,
    email: row.email,
    createdAt: row.createdAt,
  });
}

export class UserRepository implements BaseRepository<UserEntity, number> {
  async findById(id: number): Promise<UserEntity | null> {
    const [row] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return row ? toEntity(row) : null;
  }

  async findByClerkUserId(clerkUserId: string): Promise<UserEntity | null> {
    const [row] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, clerkUserId))
      .limit(1);
    return row ? toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [row] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    return row ? toEntity(row) : null;
  }

  async save(entity: UserEntity): Promise<UserEntity> {
    const [row] = await db
      .insert(usersTable)
      .values({
        clerkUserId: entity.clerkUserId,
        name: entity.name,
        age: entity.age,
        email: entity.email,
      })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: {
          clerkUserId: entity.clerkUserId,
          name: entity.name,
          age: entity.age,
          email: entity.email,
        },
      })
      .returning();
    return toEntity(row);
  }

  async delete(id: number): Promise<void> {
    const [row] = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
    if (!row) {
      throw new NotFoundError("User", id);
    }
  }
}
