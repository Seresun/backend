import { IsString, IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  text: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
