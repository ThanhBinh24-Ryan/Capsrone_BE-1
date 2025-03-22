import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
// 🔥 API: GET thông tin user hiện tại
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@Get('me')
async getUserInfo(@Req() req) {
  console.log('req.user:', req.user); // Debug req.user
  if (!req.user) {
    throw new HttpException('Unauthorized: User not found in token', HttpStatus.UNAUTHORIZED);
  }
  if (!req.user.userId || isNaN(req.user.userId)) { // Sửa id thành userId
    throw new HttpException('Unauthorized: Invalid user ID in token', HttpStatus.UNAUTHORIZED);
  }
  return await this.usersService.getUserInfo(req.user.userId); // Sửa id thành userId
}
  

  // 🔥 API 2: GET danh sách ảnh đã lưu theo user id
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Get('saved')
  getSavedImages(@Req() req) {
    return this.usersService.getSavedImages(req.user.id);
  }

  // 🔥 API 3: GET danh sách ảnh đã tạo theo user id
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Get('created')
  getCreatedImages(@Req() req) {
    return this.usersService.getCreatedImages(req.user.id);
  }

  // 🔥 API 4: PUT cập nhật thông tin cá nhân của user

 @UseGuards(AuthGuard)
 @ApiBearerAuth('access-token')
 @Put('me')
 async updateUserInfo(@Body() updateUserDto: UpdateUserDto, @Req() req) {
   console.log('req.user:', req.user); // Debug req.user
   if (!req.user) {
     throw new HttpException('Unauthorized: User not found in token', HttpStatus.UNAUTHORIZED);
   }
   if (!req.user.userId || isNaN(req.user.userId)) { // Sửa id thành userId
     throw new HttpException('Unauthorized: Invalid user ID in token', HttpStatus.UNAUTHORIZED);
   }
   return await this.usersService.updateUserInfo(req.user.userId, updateUserDto); // Sửa id thành userId
 }
}