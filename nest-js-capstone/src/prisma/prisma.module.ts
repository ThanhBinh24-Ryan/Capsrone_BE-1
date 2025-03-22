import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Xuất ra để các module khác có thể dùng
})
export class PrismaModule {}
