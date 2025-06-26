import { decrypt, encrypt } from '@/utils/crypto-utils';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Index(['userId', 'projectId'], { unique: true })
@Entity({ name: 'datasource', schema: 'public' })
export class Datasource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  projectId: string;

  @Column({ name: 'databaseUrl', nullable: true })
  private _databaseUrl: string;

  @Column({ name: 'port', nullable: true })
  private _port: string;

  @Column({ name: 'databaseName', nullable: true })
  private _databaseName: string;

  @Column({ name: 'username', nullable: true })
  private _username: string;

  @Column({ name: 'password', nullable: true })
  private _password: string;

  get databaseUrl(): string {
    return this._databaseUrl ? decrypt(this._databaseUrl) : '';
  }

  set databaseUrl(value: string) {
    this._databaseUrl = value ? encrypt(value) : '';
  }

  get port(): string {
    return this._port ? decrypt(this._port) : '';
  }

  set port(value: string) {
    this._port = value ? encrypt(value) : '';
  }

  get databaseName(): string {
    return this._databaseName ? decrypt(this._databaseName) : '';
  }

  set databaseName(value: string) {
    this._databaseName = value ? encrypt(value) : '';
  }

  get username(): string {
    return this._username ? decrypt(this._username) : '';
  }

  set username(value: string) {
    this._username = value ? encrypt(value) : '';
  }

  get password(): string {
    return this._password ? decrypt(this._password) : '';
  }

  set password(value: string) {
    this._password = value ? encrypt(value) : '';
  }

  @Column()
  type: string;

  @Column({default: false})
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
