import { users_status } from '@prisma/client';

export class CreateUserDto {
  username!: string;
  email!: string;
  password!: string;
  status?: users_status;
}
