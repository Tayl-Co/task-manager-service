import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDo } from '@todo/entity/todo.entity';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { ToDoRepository } from '@todo/repository/todo.repository';
import { ProjectModule } from '@project/project.module';
import { Reference } from '@reference/entity/reference.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ToDo, Reference]), ProjectModule],
    exports: [TypeOrmModule],
    providers: [TodoService, TodoResolver, ToDoRepository],
})
export class TodoModule {}
