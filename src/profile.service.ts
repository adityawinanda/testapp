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

interface HoroscopeRef {
  startDate: number;
  startMonth: number;
  endDate: number;
  endMonth: number;
  name: string;
}

const horoscopeReferences: HoroscopeRef[] = [
  {startDate: 21, startMonth: 3, endDate: 19, endMonth: 4, name: "Aries (Ram)"}, 
  {startDate: 20, startMonth: 4, endDate: 20, endMonth: 5, name: "Taurus (Bull)"}, 
  {startDate: 21, startMonth: 5, endDate: 20, endMonth: 6, name: "Gemini (Twins)"}, 
  {startDate: 22, startMonth: 6, endDate: 22, endMonth: 7, name: "Cancer (Crab)"}, 
  {startDate: 23, startMonth: 7, endDate: 22, endMonth: 8, name: "Leon (Lion)"}, 
  {startDate: 23, startMonth: 8, endDate: 22, endMonth: 9, name: "Virgo (Virgin)"}, 
  {startDate: 23, startMonth: 9, endDate: 23, endMonth: 10, name: "Libra (Balance)"}, 
  {startDate: 24, startMonth: 10, endDate: 21, endMonth: 11, name: "Scorpio (Scorpion)"}, 
  {startDate: 22, startMonth: 11, endDate: 21, endMonth: 12, name: "Sagittarius (Archer)"}, 
  {startDate: 22, startMonth: 12, endDate: 19, endMonth: 1, name: "Carpicornnus (Goat)"}, 
  {startDate: 20, startMonth: 1, endDate: 18, endMonth: 2, name: "Aquaris (Water Bearer)"}, 
  {startDate: 19, startMonth: 2, endDate: 20, endMonth: 3, name: "Pisces (Fish)"}, 
];

// YYYY-mm-dd
function calculateHoroscope(birthday: string): HoroscopeRef {
  const parts = birthday.split("-");
  const date = parseInt(parts[2]);
  const month = parseInt(parts[1]);

  let i: number;
  for (i=0; i<horoscopeReferences.length; i++) {
    if (horoscopeReferences[i].startMonth === month) {
      if (date >= horoscopeReferences[i].startDate) {
        return horoscopeReferences[i];
      } else {
        return i === 0 ? horoscopeReferences[horoscopeReferences.length - 1] : horoscopeReferences[i-1];
      }
    }
  }
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
