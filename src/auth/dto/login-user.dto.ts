import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {


    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50, {
        message: "password shuld be less that 50 characters"
    })
    password: string;

}
