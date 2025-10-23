import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createTodoDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(`Category with ID ${createTodoDto.categoryId} not found`);
    }

    // Check if category already has 5 or more tasks
    const existingTasksCount = await this.prisma.todo.count({
      where: { categoryId: createTodoDto.categoryId },
    });

    if (existingTasksCount >= 5) {
      throw new BadRequestException(`Category '${category.name}' already has 5 tasks.`);
    }

    const todo = await this.prisma.todo.create({
      data: createTodoDto,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return todo;
  }

  async findAll(category?: string): Promise<Todo[]> {
    let where = {};
    
    // If category is provided and not "All", filter by category ID
    if (category && category !== 'All') {
      where = { categoryId: category };
    }
    
    return this.prisma.todo.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async updateStatus(id: string, updateTodoStatusDto: UpdateTodoStatusDto): Promise<Todo> {
    try {
      const todo = await this.prisma.todo.update({
        where: { id },
        data: { completed: updateTodoStatusDto.completed },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return todo;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.todo.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }
      throw error;
    }
  }

}
