import { HttpException, HttpStatus, HttpVersionNotSupportedException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile } from './profile.schema';
import { ProfileDto, UnexpectedMessage } from './dto';

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

interface ZodiacRef {
  startDate: number;
  startMonth: number;
  startYear: number;
  endDate: number;
  endMonth: number;
  endYear: number;
  sign: string;
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
  {startDate: 22, startMonth: 12, endDate: 19, endMonth: 1, name: "Capricornus (Goat)"}, 
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


const zodiacReferences: ZodiacRef[] = [
  {"sign": "Rat", "startDate": 28, "startMonth": 1, "startYear": 1960, "endDate": 14, "endMonth": 2, "endYear": 1961},
  {"sign": "Ox", "startDate": 15, "startMonth": 2, "startYear": 1961, "endDate": 4, "endMonth": 2, "endYear": 1962},
  {"sign": "Tiger", "startDate": 5, "startMonth": 2, "startYear": 1962, "endDate": 24, "endMonth": 1, "endYear": 1963},
  {"sign": "Rabbit", "startDate": 25, "startMonth": 1, "startYear": 1963, "endDate": 12, "endMonth": 2, "endYear": 1964},
  {"sign": "Dragon", "startDate": 13, "startMonth": 2, "startYear": 1964, "endDate": 1, "endMonth": 2, "endYear": 1965},
  {"sign": "Snake", "startDate": 2, "startMonth": 2, "startYear": 1965, "endDate": 20, "endMonth": 1, "endYear": 1966},
  {"sign": "Horse", "startDate": 21, "startMonth": 1, "startYear": 1966, "endDate": 8, "endMonth": 2, "endYear": 1967},
  {"sign": "Goat", "startDate": 9, "startMonth": 2, "startYear": 1967, "endDate": 29, "endMonth": 1, "endYear": 1968},
  {"sign": "Monkey", "startDate": 30, "startMonth": 1, "startYear": 1968, "endDate": 16, "endMonth": 2, "endYear": 1969},
  {"sign": "Rooster", "startDate": 17, "startMonth": 2, "startYear": 1969, "endDate": 5, "endMonth": 2, "endYear": 1970},
  {"sign": "Dog", "startDate": 6, "startMonth": 2, "startYear": 1970, "endDate": 26, "endMonth": 1, "endYear": 1971},
  {"sign": "Pig", "startDate": 27, "startMonth": 1, "startYear": 1971, "endDate": 15, "endMonth": 1, "endYear": 1972},
  {"sign": "Rat", "startDate": 16, "startMonth": 1, "startYear": 1972, "endDate": 2, "endMonth": 2, "endYear": 1973},
  {"sign": "Ox", "startDate": 3, "startMonth": 2, "startYear": 1973, "endDate": 22, "endMonth": 1, "endYear": 1974},
  {"sign": "Tiger", "startDate": 23, "startMonth": 1, "startYear": 1974, "endDate": 10, "endMonth": 2, "endYear": 1975},
  {"sign": "Rabbit", "startDate": 11, "startMonth": 2, "startYear": 1975, "endDate": 30, "endMonth": 1, "endYear": 1976},
  {"sign": "Dragon", "startDate": 31, "startMonth": 1, "startYear": 1976, "endDate": 17, "endMonth": 2, "endYear": 1977},
  {"sign": "Snake", "startDate": 18, "startMonth": 2, "startYear": 1977, "endDate": 6, "endMonth": 2, "endYear": 1978},
  {"sign": "Horse", "startDate": 7, "startMonth": 2, "startYear": 1978, "endDate": 27, "endMonth": 1, "endYear": 1979},
  {"sign": "Goat", "startDate": 28, "startMonth": 1, "startYear": 1979, "endDate": 15, "endMonth": 2, "endYear": 1980},
  {"sign": "Monkey", "startDate": 16, "startMonth": 2, "startYear": 1980, "endDate": 4, "endMonth": 2, "endYear": 1981},
  {"sign": "Rooster", "startDate": 5, "startMonth": 2, "startYear": 1981, "endDate": 24, "endMonth": 1, "endYear": 1982},
  {"sign": "Dog", "startDate": 25, "startMonth": 1, "startYear": 1982, "endDate": 12, "endMonth": 2, "endYear": 1983},
  {"sign": "Pig", "startDate": 13, "startMonth": 2, "startYear": 1983, "endDate": 1, "endMonth": 2, "endYear": 1984},
  {"sign": "Rat", "startDate": 2, "startMonth": 2, "startYear": 1984, "endDate": 19, "endMonth": 2, "endYear": 1985},
  {"sign": "Ox", "startDate": 20, "startMonth": 2, "startYear": 1985, "endDate": 8, "endMonth": 2, "endYear": 1986},
  {"sign": "Tiger", "startDate": 9, "startMonth": 2, "startYear": 1986, "endDate": 28, "endMonth": 1, "endYear": 1987},
  {"sign": "Rabbit", "startDate": 29, "startMonth": 1, "startYear": 1987, "endDate": 16, "endMonth": 2, "endYear": 1988},
  {"sign": "Dragon", "startDate": 17, "startMonth": 2, "startYear": 1988, "endDate": 5, "endMonth": 2, "endYear": 1989},
  {"sign": "Snake", "startDate": 6, "startMonth": 2, "startYear": 1989, "endDate": 26, "endMonth": 1, "endYear": 1990},
  {"sign": "Horse", "startDate": 27, "startMonth": 1, "startYear": 1990, "endDate": 14, "endMonth": 2, "endYear": 1991},
  {"sign": "Goat", "startDate": 15, "startMonth": 2, "startYear": 1991, "endDate": 3, "endMonth": 2, "endYear": 1992},
  {"sign": "Monkey", "startDate": 4, "startMonth": 2, "startYear": 1992, "endDate": 22, "endMonth": 1, "endYear": 1993},
  {"sign": "Rooster", "startDate": 23, "startMonth": 1, "startYear": 1993, "endDate": 9, "endMonth": 2, "endYear": 1994},
  {"sign": "Dog", "startDate": 10, "startMonth": 2, "startYear": 1994, "endDate": 30, "endMonth": 1, "endYear": 1995},
  {"sign": "Pig", "startDate": 31, "startMonth": 1, "startYear": 1995, "endDate": 18, "endMonth": 2, "endYear": 1996},
  {"sign": "Rat", "startDate": 19, "startMonth": 2, "startYear": 1996, "endDate": 6, "endMonth": 2, "endYear": 1997},
  {"sign": "Ox", "startDate": 7, "startMonth": 2, "startYear": 1997, "endDate": 27, "endMonth": 1, "endYear": 1998},
  {"sign": "Tiger", "startDate": 28, "startMonth": 1, "startYear": 1998, "endDate": 15, "endMonth": 2, "endYear": 1999},
  {"sign": "Rabbit", "startDate": 16, "startMonth": 2, "startYear": 1999, "endDate": 4, "endMonth": 2, "endYear": 2000},
  {"sign": "Dragon", "startDate": 5, "startMonth": 2, "startYear": 2000, "endDate": 23, "endMonth": 1, "endYear": 2001},
  {"sign": "Snake", "startDate": 24, "startMonth": 1, "startYear": 2001, "endDate": 11, "endMonth": 2, "endYear": 2002},
  {"sign": "Horse", "startDate": 12, "startMonth": 2, "startYear": 2002, "endDate": 31, "endMonth": 1, "endYear": 2003},
  {"sign": "Goat", "startDate": 1, "startMonth": 2, "startYear": 2003, "endDate": 21, "endMonth": 1, "endYear": 2004},
  {"sign": "Monkey", "startDate": 22, "startMonth": 1, "startYear": 2004, "endDate": 8, "endMonth": 2, "endYear": 2005},
  {"sign": "Rooster", "startDate": 9, "startMonth": 2, "startYear": 2005, "endDate": 28, "endMonth": 1, "endYear": 2006},
  {"sign": "Dog", "startDate": 29, "startMonth": 1, "startYear": 2006, "endDate": 17, "endMonth": 2, "endYear": 2007},
  {"sign": "Pig", "startDate": 18, "startMonth": 2, "startYear": 2007, "endDate": 6, "endMonth": 2, "endYear": 2008},
  {"sign": "Rat", "startDate": 7, "startMonth": 2, "startYear": 2008, "endDate": 25, "endMonth": 1, "endYear": 2009},
  {"sign": "Ox", "startDate": 26, "startMonth": 1, "startYear": 2009, "endDate": 13, "endMonth": 2, "endYear": 2010},
  {"sign": "Tiger", "startDate": 14, "startMonth": 2, "startYear": 2010, "endDate": 2, "endMonth": 2, "endYear": 2011},
  {"sign": "Rabbit", "startDate": 3, "startMonth": 2, "startYear": 2011, "endDate": 22, "endMonth": 1, "endYear": 2012},
  {"sign": "Dragon", "startDate": 23, "startMonth": 1, "startYear": 2012, "endDate": 9, "endMonth": 2, "endYear": 2013},
  {"sign": "Snake", "startDate": 10, "startMonth": 2, "startYear": 2013, "endDate": 30, "endMonth": 1, "endYear": 2014},
  {"sign": "Horse", "startDate": 31, "startMonth": 1, "startYear": 2014, "endDate": 18, "endMonth": 2, "endYear": 2015},
  {"sign": "Goat", "startDate": 19, "startMonth": 2, "startYear": 2015, "endDate": 7, "endMonth": 2, "endYear": 2016},
  {"sign": "Monkey", "startDate": 8, "startMonth": 2, "startYear": 2016, "endDate": 27, "endMonth": 1, "endYear": 2017},
  {"sign": "Rooster", "startDate": 28, "startMonth": 1, "startYear": 2017, "endDate": 15, "endMonth": 2, "endYear": 2018},
  {"sign": "Dog", "startDate": 16, "startMonth": 2, "startYear": 2018, "endDate": 4, "endMonth": 2, "endYear": 2019},
  {"sign": "Pig", "startDate": 5, "startMonth": 2, "startYear": 2019, "endDate": 24, "endMonth": 1, "endYear": 2020},
  {"sign": "Rat", "startDate": 25, "startMonth": 1, "startYear": 2020, "endDate": 11, "endMonth": 2, "endYear": 2021},
  {"sign": "Ox", "startDate": 12, "startMonth": 2, "startYear": 2021, "endDate": 31, "endMonth": 1, "endYear": 2022},
  {"sign": "Tiger", "startDate": 1, "startMonth": 2, "startYear": 2022, "endDate": 21, "endMonth": 1, "endYear": 2023},
  {"sign": "Rabbit", "startDate": 22, "startMonth": 1, "startYear": 2023, "endDate": 9, "endMonth": 2, "endYear": 2024}

];

function calculateZodiac(birthday: string) {
  const parts = birthday.split("-");
  const date = parseInt(parts[2]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[0]);

  // since max days in month is 31.
  // use that as reference for counting the days (we're rounding just to get the range comparison to function properly)
  const daysInMonth = month*31 + date;

  for (let i=0; i<zodiacReferences.length; i++) {
    if (zodiacReferences[i].startYear === year) {
      const daysInMonthInZodiac = zodiacReferences[i].startMonth*31 + zodiacReferences[i].startDate;
      if (daysInMonth >= daysInMonthInZodiac) {
        return zodiacReferences[i];
      } else {
        return i === 0 ? zodiacReferences[zodiacReferences.length - 1] : zodiacReferences[i-1];
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
      zodiac: calculateZodiac(birthDay).sign,
      userId: new Types.ObjectId(userId),
    });
    return newProfile.save();
  }

  async getProfile(userId: string): Promise<Profile | null> {
    return this.profileCollection.findOne({userId: new Types.ObjectId(userId)});
  }

  async updateProfile(
    userId: string,
    displayName: string,
    gender: Gender,
    birthDay: string,
    weight: number,
    height: number,
    measurementUnit: MeasurementUnit,
    ): Promise<Profile | null> {

    const newProfile = {
      displayName,
      gender,
      birthDay,
      weight,
      height,
      measurementUnit,
      horoscope: calculateHoroscope(birthDay).name,
      zodiac: calculateZodiac(birthDay).sign,
    };

    return this.profileCollection.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      newProfile,
      {new: true, runValidators: true}
    );
  }
}
