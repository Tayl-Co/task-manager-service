import { Module } from '@nestjs/common';
import { ReferenceResolver } from './reference.resolver';
import { ReferenceService } from './reference.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reference } from '@reference/entity/reference.entity';
import { TodoModule } from '@todo/todo.module';

@Module({
    imports: [TypeOrmModule.forFeature([Reference]), TodoModule],
    providers: [ReferenceResolver, ReferenceService],
})
export class ReferenceModule {}
