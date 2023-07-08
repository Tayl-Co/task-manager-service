import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsOrderValue, In, Like, Repository } from 'typeorm';
import { Project } from '@project/entity/project.entity';
import { ProjectDto } from '@project/dtos/project.dto';
import { TeamService } from '@team/team.service';
import { SearchProjectDto } from '@project/dtos/searchProject.dto';
import { Order } from '@src/common/enums/order.enum';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private teamService: TeamService,
    ) {}

    /**
     * Create a project
     * @param { ProjectDto } projectInput Project Data
     * @return Project created
     */
    async create(projectInput: ProjectDto): Promise<Project> {
        const { name, teamId } = projectInput;
        const project = await this.projectRepository.findOne({
            where: { name: Equal(name) },
        });

        if (project)
            throw new ConflictException(
                `The ${project.name} Project already exists`,
            );

        const team = await this.teamService.findOne(teamId);

        const newProject = this.projectRepository.create({
            ...projectInput,
            team,
        });

        return this.projectRepository.save(newProject);
    }

    search(searchInput: SearchProjectDto): Promise<Array<Project>> {
        const {
            ids,
            name,
            description,
            active,
            sortOrder = Order.ASC,
            orderBy = 'name',
            page = 0,
            limit,
        } = searchInput;
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (description)
            where = { ...where, description: Like(`%${description}%`) };

        if (active !== undefined) where = { ...where, active };

        return this.projectRepository.find({
            relations: { team: true },
            where: { name: Like(`%${name}%`), ...where },
            order: { [orderBy]: sortOrder as FindOptionsOrderValue },
            take: limit,
            skip: page * limit,
        });
    }

    /**
     * Find a Project
     * @param id Project identification
     * @return Project
     */
    async findOne(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne({
            relations: { team: true, issues: true },
            where: { id },
        });

        if (!project) throw new NotFoundException(`Project ${id} not found`);

        return project;
    }

    async delete(id: number) {
        const project = await this.findOne(id);

        if (!project) throw new NotFoundException(`Project ${id} not found`);

        await this.projectRepository.delete(id);

        return project;
    }

    async update(
        id: number,
        { name, description, active, teamId }: ProjectDto,
    ): Promise<Project> {
        const project = await this.findOne(id);

        Object.assign(project, { name, description, active });

        if (teamId !== project.team.id) {
            project.team = await this.teamService.findOne(teamId);
        }

        return await this.projectRepository.save(project);
    }

    async disable(id: number): Promise<Project> {
        const project = await this.findOne(id);

        return this.projectRepository.save({ ...project, active: false });
    }
}
