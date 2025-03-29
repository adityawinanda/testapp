import { HttpStatus } from "@nestjs/common";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { Gender, MeasurementUnit } from "./profile.service";

export interface SuccessResponse {
    status: HttpStatus;
    payload: any;
}

export function createSuccessResponse(payload: any): SuccessResponse {
  return {
    status: HttpStatus.OK,
    payload: payload,
  }  
}

export class RegistrationInputDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginInputDto {
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsNotEmpty()
  password: string;
}

export class ProfileDto {
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  // YYYY-mm-dd
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/) // a date in YYYY-mm-dd format
  birthday: string; 

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsEnum(MeasurementUnit)
  measurementUnit: MeasurementUnit;
}
