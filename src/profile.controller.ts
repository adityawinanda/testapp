import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { createSuccessResponse, ProfileDto, SuccessResponse } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("createProfile")
  async createProfile(@Req() req: any, @Body() profile: ProfileDto): Promise<SuccessResponse> {
    const id = req.user.id;

    await this.profileService.createProfile(
      profile.displayName, profile.gender, profile.birthday, profile.weight, profile.height, profile.measurementUnit, id
    );

    return createSuccessResponse(true);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getProfile")
  async getProfile(@Req() req: any): Promise<SuccessResponse> {
    const userId: string = req.user.id;

    const profile = await this.profileService.getProfile(userId);
    const payload = { profile };

    return createSuccessResponse(payload);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("updateProfile")
  async updateProfile(@Req() req: any, @Body() profile: ProfileDto): Promise<SuccessResponse> {
    const userId: string = req.user.id;

    const updated = this.profileService.updateProfile(userId, profile);    
    if (!updated) {
      throw new HttpException("Cannot update profile", HttpStatus.FORBIDDEN);
    }

    return createSuccessResponse(true);
  }
}
