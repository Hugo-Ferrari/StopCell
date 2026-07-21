import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DiagnosticoDto {
    @IsInt()
    @IsNotEmpty()
    numOs: number=0

    @IsString()
    @IsNotEmpty()
    relatoTecnico: string=''
}