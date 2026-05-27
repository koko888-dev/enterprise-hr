import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    
    // Parse DATABASE_URL for MariaDB/MySQL adapter
    const adapter = new PrismaMariaDb({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port || '3306'),
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.substring(1), // Remove leading slash
    });

    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
