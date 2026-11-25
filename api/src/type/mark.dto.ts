import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class MarcaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nmMarca: string =''
}