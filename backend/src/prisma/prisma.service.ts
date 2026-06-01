import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    
    // Resolve localhost to IPv4 loopback (127.0.0.1) to prevent Node.js IPv6 resolution timeout issues in local Windows MySQL setups
    const host = dbUrl.hostname === 'localhost' ? '127.0.0.1' : dbUrl.hostname;

    const adapter = new PrismaMariaDb({
      host: host,
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
