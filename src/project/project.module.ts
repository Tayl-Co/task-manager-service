import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@project/entity/project.entity';
import { ProjectService } from '@project/project.service';
import { TeamModule } from '@team/team.module';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), TeamModule],
    providers: [ProjectResolver, ProjectService],
    exports: [TypeOrmModule, ProjectService],
})
export class ProjectModule {}
