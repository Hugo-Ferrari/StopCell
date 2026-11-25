import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class categoriaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nmCategoria!: string
}