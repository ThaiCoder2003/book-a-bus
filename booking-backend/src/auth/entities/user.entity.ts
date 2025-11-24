import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('users') // Specifies the name of the table in the database
@Unique(['email']) // Ensures the email column is unique
export class User {
  @PrimaryGeneratedColumn('uuid') // Uses a standard UUID for the primary key (PK)
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  // Store the hashed password. Note the { select: false } decorator,
  // which prevents this column from being returned by default when fetching users,
  // enhancing security.
  @Column({ name: 'password_hash', select: false })
  passwordHash!: string;

  // The role column for Authorization (RBAC)
  @Column({ default: 'user' })
  role!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column({ type: 'text', nullable: true, select: false })
  currentHashedRefreshToken?: string | null;
}
