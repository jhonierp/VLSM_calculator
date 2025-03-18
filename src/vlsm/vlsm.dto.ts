import { Transform } from 'class-transformer';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VlsmDto {
  @ApiProperty({ example: '172.29.0.0', description: 'Dirección de red base' })
  @IsString()
  network: string;

  @ApiProperty({ example: 16, description: 'Máscara de red en notación CIDR' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(30)
  mask: number;

  @ApiProperty({
    example: '4,10,20',
    description: 'Lista de hosts requeridos separados por comas',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((num) => parseInt(num.trim(), 10))
      : value,
  )
  @IsArray()
  @ArrayMinSize(1)
  hosts: number[];
}
