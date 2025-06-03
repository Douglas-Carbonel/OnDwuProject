
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
      console.log("🔧 Tentando criar usuário:", userData.username, userData.user_mail);
      
      // Verificar se o email já existe
      const existingUser = await this.getDb()
        .select()
        .from(users)
        .where(eq(users.user_mail, userData.user_mail))
        .limit(1);

      if (existingUser.length > 0) {
        console.log("❌ Email já existe no banco:", userData.user_mail);
        return null;
      }

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

      console.log("✅ Usuário criado com sucesso:", newUser[0]);
      return newUser[0];
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
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

  async updateUser(id: number, userData: {
    username?: string;
    user_mail?: string;
    password?: string;
    user_profile?: string;
  }): Promise<AuthUser | null> {
    try {
      console.log("🔧 Atualizando usuário ID:", id, "com dados:", userData);

      // Check if user exists
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        console.log("❌ Usuário não encontrado:", id);
        return null;
      }

      // Check if email is being changed and if it already exists
      if (userData.user_mail && userData.user_mail !== existingUser.user_mail) {
        const emailExists = await this.getDb()
          .select()
          .from(users)
          .where(eq(users.user_mail, userData.user_mail))
          .limit(1);

        if (emailExists.length > 0) {
          console.log("❌ Email já existe:", userData.user_mail);
          return null;
        }
      }

      // Prepare update data
      const updateData: any = {};
      
      if (userData.username) updateData.username = userData.username;
      if (userData.user_mail) updateData.user_mail = userData.user_mail;
      if (userData.user_profile) updateData.user_profile = userData.user_profile;
      
      // Hash password if provided
      if (userData.password) {
        updateData.password = await bcrypt.hash(userData.password, 10);
      }

      const updatedUser = await this.getDb()
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          username: users.username,
          user_mail: users.user_mail,
          user_profile: users.user_profile,
        });

      console.log("✅ Usuário atualizado:", updatedUser[0]);
      return updatedUser[0];
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      console.log("🗑️ Excluindo usuário ID:", id);

      // Check if user exists
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        console.log("❌ Usuário não encontrado:", id);
        return false;
      }

      await this.getDb()
        .delete(users)
        .where(eq(users.id, id));

      console.log("✅ Usuário excluído com sucesso:", id);
      return true;
    } catch (error) {
      console.error("❌ Erro ao excluir usuário:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
