import { IsString, IsNotEmpty } from 'class-validator';

export class osChecklistDto {
    @IsString()
    @IsNotEmpty()
    status: string=''
}