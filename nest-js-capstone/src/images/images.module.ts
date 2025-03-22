import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // 👈 Import PrismaModule
import { AuthModule } from 'src/auth/auth.module';
 
@Module({
  
  imports: [PrismaModule,AuthModule], // 👈 Thêm dòng này
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
