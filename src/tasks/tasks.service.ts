import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      if (
        createTaskDto.members &&
        createTaskDto.members.includes(createTaskDto.reporter)
      ) {
        throw new ConflictException(
          'Reporter and Member cannot be the same user.',
        );
      }
      console.log('DATA: ', createTaskDto);

      const task = await this.taskModel.create(createTaskDto);
      return {
        message: 'Task created',
        task,
      };
    } catch (error) {
      console.log('Error in Task creation: ', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.taskModel
        .find()
        .populate('reporter')
        .populate('members')
        .populate('updatedBy');
    } catch (error) {
      console.log('Error in Task findAll: ', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.taskModel
        .findById(id)
        .populate('reporter')
        .populate('members')
        .populate('updatedBy');

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      console.log('Error in Task findOne: ', error);
      throw error;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      if (updateTaskDto.reporter || updateTaskDto.members) {
        const existingTask = await this.taskModel.findById(id);
        if (!existingTask) {
          throw new NotFoundException(`Task with ID ${id} not found`);
        }

        const reporter =
          updateTaskDto.reporter ?? existingTask.reporter.toString();
        const members =
          updateTaskDto.members ??
          existingTask.members.map((m) => m.toString());

        if (members.includes(reporter)) {
          throw new ConflictException(
            'Reporter and Member cannot be the same user.',
          );
        }
      }

      const updatedTask = await this.taskModel
        .findByIdAndUpdate(id, updateTaskDto, { new: true })
        .populate('reporter')
        .populate('members')
        .populate('updatedBy');

      if (!updatedTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return {
        message: 'Task updated',
        task: updatedTask,
      };
    } catch (error) {
      console.log('Error in Task update: ', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const deletedTask = await this.taskModel.findByIdAndDelete(id);
      if (!deletedTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return {
        message: 'Task deleted',
        task: deletedTask,
      };
    } catch (error) {
      console.log('Error in Task remove: ', error);
      throw error;
    }
  }
}
