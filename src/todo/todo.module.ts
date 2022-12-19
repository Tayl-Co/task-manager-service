import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDo } from '@todo/entity/todo.entity';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { ProjectModule } from '@project/project.module';
import { LabelModule } from '@label/label.module';
import { ActivityModule } from '@activity/activity.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ToDo]),
        ProjectModule,
        LabelModule,
        ActivityModule,
    ],
    exports: [TypeOrmModule, TodoService],
    providers: [TodoService, TodoResolver],
})
export class TodoModule {}
