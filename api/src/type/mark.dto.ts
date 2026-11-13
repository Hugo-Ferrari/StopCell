import { IsString, IsNotEmpty } from 'class-validator';

export class MarcaDto {
    @IsString()
    @IsNotEmpty()
    nmMarca: string =''
}