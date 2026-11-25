import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ChecklistDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    descricao: string=''
}