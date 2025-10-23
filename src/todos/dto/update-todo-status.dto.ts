import { IsBoolean } from 'class-validator';

export class UpdateTodoStatusDto {
  @IsBoolean()
  completed: boolean;
}
