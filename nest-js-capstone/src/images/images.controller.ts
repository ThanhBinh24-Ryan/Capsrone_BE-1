import { Controller, Get, Query,Param, Post, Body, UseGuards, Req,Delete  } from '@nestjs/common';
import { ImagesService } from './images.service';
import { AuthGuard } from './../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateImageDto } from './dto/create-image.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // 🔥 API 1: GET danh sách ảnh
  @Get()
  getAllImages() {
    return this.imagesService.findAll();
  }

  // 🔥 API 2: GET tìm kiếm ảnh theo tên
  @Get('search')
  searchImages(@Query('name') name: string) {
    return this.imagesService.searchByName(name);
  }
   // 3️⃣ GET thông tin ảnh và người tạo ảnh
   @Get(':id')
   getImageById(@Param('id') id: number) {
     return this.imagesService.getImageById(Number(id));
   }
 
   // 4️⃣ GET danh sách bình luận theo ID ảnh
   @Get(':id/comments')
   getComments(@Param('id') id: number) {
     return this.imagesService.getCommentsByImageId(Number(id));
   }
 
   // 5️⃣ GET kiểm tra ảnh đã lưu hay chưa
   @UseGuards(AuthGuard)
   @ApiBearerAuth('access-token')
   @Get(':id/saved')
   isImageSaved(@Param('id') id: number, @Req() req) {
     return this.imagesService.isImageSaved(Number(id), req.user.id);
   }
 
   // 6️⃣ POST bình luận ảnh
   @UseGuards(AuthGuard)
   @ApiBearerAuth('access-token')
   @Post(':id/comment')
   postComment(@Param('id') id: number, @Body('noi_dung') noi_dung: string, @Req() req) {
     return this.imagesService.postComment({
       hinh_id: Number(id),
       nguoi_dung_id: req.user.id,
       noi_dung,
     });
   }
 
   // 🔥 API: DELETE xóa ảnh đã tạo theo id ảnh
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  async deleteImage(@Param('id') id: string, @Req() req) {
    if (!req.user) {
      throw new HttpException('Unauthorized: User not found in token', HttpStatus.UNAUTHORIZED);
    }
    if (!req.user.userId || isNaN(req.user.userId)) {
      throw new HttpException('Unauthorized: Invalid user ID in token', HttpStatus.UNAUTHORIZED);
    }
    return await this.imagesService.deleteImage(Number(id), req.user.userId); // Sửa thành imagesService
  }

  // 🔥 API: POST thêm một ảnh của user
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  async createImage(@Body() createImageDto: CreateImageDto, @Req() req) {
    if (!req.user) {
      throw new HttpException('Unauthorized: User not found in token', HttpStatus.UNAUTHORIZED);
    }
    if (!req.user.userId || isNaN(req.user.userId)) {
      throw new HttpException('Unauthorized: Invalid user ID in token', HttpStatus.UNAUTHORIZED);
    }
    return await this.imagesService.createImage(createImageDto, req.user.userId); // Sửa thành imagesService
  }
}
