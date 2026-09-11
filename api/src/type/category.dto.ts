import { IsString, IsNotEmpty } from 'class-validator';

export class categoriaDto {
    @IsString()
    @IsNotEmpty()
    nmCategoria!: string
}