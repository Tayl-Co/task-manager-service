import { Module } from '@nestjs/common';
import { ReferenceResolver } from './reference.resolver';
import { ReferenceService } from './reference.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reference } from '@reference/entity/reference.entity';
import { ReferenceRepository } from '@reference/repository/reference.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Reference])],
    providers: [ReferenceResolver, ReferenceService, ReferenceRepository],
})
export class ReferenceModule {}
