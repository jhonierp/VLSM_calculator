import {
  IsIP,
  IsInt,
  IsArray,
  Min,
  Max,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VlsmDto {
  @ApiProperty({ example: '172.18.0.0', description: 'Dirección de red base' })
  @IsIP(4, { message: 'La dirección de red debe ser una IP válida.' })
  network: string;

  @ApiProperty({ example: 2, description: 'Número de subredes' })
  @Type(() => Number)
  @IsInt({ message: 'La cantidad de subredes debe ser un número entero.' })
  @Min(1, { message: 'La cantidad de subredes debe ser al menos 1.' })
  subnets: number;

  @ApiProperty({
    example: [100, 100],
    description: 'Cantidad de hosts por subred',
  })
  @IsArray({ message: 'hosts debe ser un array de números.' })
  @ArrayNotEmpty({ message: 'Debe proporcionar al menos un valor en hosts.' })
  @ArrayMinSize(1, { message: 'Debe haber al menos una subred con hosts.' })
  @Type(() => Number)
  @IsInt({
    each: true,
    message: 'Cada valor en hosts debe ser un número entero.',
  })
  hosts: number[];
}
