import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@project/entity/project.entity';
import { ProjectService } from '@project/project.service';
import { ProjectRepository } from '@project/repository/project.repository';
import { TeamModule } from '@team/team.module';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), TeamModule],
    providers: [ProjectResolver, ProjectService, ProjectRepository],
    exports: [TypeOrmModule],
})
export class ProjectModule {}
