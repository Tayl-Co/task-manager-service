import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDo } from '@todo/entity/todo.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ToDo])],
    exports: [TypeOrmModule],
})
export class TodoModule {}
