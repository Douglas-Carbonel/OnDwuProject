
import { getDatabase } from "./database";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface AuthUser {
  id: number;
  username: string;
  user_mail: string;
  user_profile: string;
}

export class AuthService {
  private db: ReturnType<typeof getDatabase> | null = null;

  private getDb() {
    if (!this.db) {
      this.db = getDatabase();
    }
    return this.db;
  }

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    try {
      const user = await this.getDb()
        .select({
          id: users.id,
          username: users.username,
          user_mail: users.user_mail,
          user_profile: users.user_profile,
          password: users.password,
        })
        .from(users)
        .where(eq(users.user_mail, email))
        .limit(1);

      if (user.length === 0) {
        return null;
      }

      const userData = user[0];
      
      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, userData.password);
      
      if (!isValidPassword) {
        return null;
      }

      // Retornar dados do usuário sem a senha
      return {
        id: userData.id,
        username: userData.username,
        user_mail: userData.user_mail,
        user_profile: userData.user_profile,
      };
    } catch (error) {
      console.error("Error validating user:", error);
      return null;
    }
  }

  async createUser(userData: {
    username: string;
    password: string;
    user_mail: string;
    user_profile: string;
  }): Promise<AuthUser | null> {
    try {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await this.getDb()
        .insert(users)
        .values({
          username: userData.username,
          password: hashedPassword,
          user_mail: userData.user_mail,
          user_profile: userData.user_profile,
        })
        .returning({
          id: users.id,
          username: users.username,
          user_mail: users.user_mail,
          user_profile: users.user_profile,
        });

      return newUser[0];
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  async debugFindUser(email: string): Promise<AuthUser | null> {
    try {
      const user = await this.getDb()
        .select({
          id: users.id,
          username: users.username,
          user_mail: users.user_mail,
          user_profile: users.user_profile,
          password: users.password,
        })
        .from(users)
        .where(eq(users.user_mail, email))
        .limit(1);

      if (user.length === 0) {
        return null;
      }

      const userData = user[0];
      
      return {
        id: userData.id,
        username: userData.username,
        user_mail: userData.user_mail,
        user_profile: userData.user_profile,
      };
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  }

  async getUserById(id: number): Promise<AuthUser | null> {
    try {
      const user = await this.getDb()
        .select({
          id: users.id,
          username: users.username,
          user_mail: users.user_mail,
          user_profile: users.user_profile,
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (user.length === 0) {
        return null;
      }

      return user[0];
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }
  }

  async getAllUsers(): Promise<AuthUser[]> {
    try {
      const allUsers = await this.getDb()
        .select({
          id: users.id,
          username: users.username,
          user_mail: users.user_mail,
          user_profile: users.user_profile,
        })
        .from(users)
        .orderBy(users.username);

      return allUsers;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }
}

export const authService = new AuthService();
