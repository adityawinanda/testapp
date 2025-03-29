import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile } from './profile.schema';
import { ProfileDto } from './dto';

export enum Gender {
  Male = "male",
  Female = "female",
}

export enum MeasurementUnit {
  SI = "si", // kg
  US = "us" // pound
}


@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileCollection: Model<Profile>) {}

  async createProfile(
    displayName: string,
    gender: Gender,
    birthDay: string,
    weight: number,
    height: number,
    measurementUnit: MeasurementUnit,
    userId: string,
  ): Promise<Profile> {

    const newProfile = new this.profileCollection({
      displayName,
      gender,
      birthDay,
      weight,
      height,
      measurementUnit,
      horoscope: calculateHoroscope(birthDay).name,
      userId: new Types.ObjectId(userId),
    });
    return newProfile.save();
  }

  async getProfile(userId: string): Promise<Profile | null> {
    return this.profileCollection.findOne({userId: new Types.ObjectId(userId)});
  }

  async updateProfile(userId: string, profile: ProfileDto): Promise<Profile | null> {
    const newProfile = new this.profileCollection(profile);

    return this.profileCollection.findByIdAndUpdate(
      new Types.ObjectId(userId),
      newProfile
    )
  }
}
