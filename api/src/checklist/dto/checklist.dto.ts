import { IsString, IsNotEmpty } from 'class-validator';

export class ChecklistDto {
    @IsString()
    @IsNotEmpty()
    descricao: string=''
}