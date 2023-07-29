import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsOrderValue, ILike, In, Repository } from 'typeorm';
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
     * Creates a project and returns the created project
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

    /**
     * Returns projects found based on search input
     * @param searchInput
     * @param searchInput.ids List of Project IDs you want to find
     * @param searchInput.name Name of the project you want to find
     * @param searchInput.description Description of the project you want to find
     * @param searchInput.active Search for active or non-active products
     * @param [searchInput.sortOrder = "ASC"] Search sort order
     * @param [searchInput.orderBy = "name"] Set property to sort Projects
     * @param [searchInput.page = 0] Current search page
     * @param searchInput.limit Limit of returned projects
     * @return Array<Project>
     */
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

        if (name) where = { ...where, name: ILike(`%${name}%`) };

        if (ids) where = { ...where, id: In(ids) };

        if (description)
            where = { ...where, description: ILike(`%${description}%`) };

        if (active !== undefined) where = { ...where, active };

        return this.projectRepository.find({
            relations: { team: true },
            where,
            order: { [orderBy]: sortOrder as FindOptionsOrderValue },
            take: limit || undefined,
            skip: limit ? page * limit : page,
        });
    }

    /**
     * Returns project based on id
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

    /**
     * Delete project based on id
     * @param id Project identification
     * @return Project
     */
    async delete(id: number) {
        const project = await this.findOne(id);

        await this.projectRepository.delete(id);

        return project;
    }

    /**
     * Update the project and returns the updated project
     * @param id Project identification
     * @param project Project Data
     * @param project.name Project name
     * @param project.description Project description
     * @param project.active Status to identify if the project is active or not
     * @param project.teamId Project team identifier
     * @return Project
     */
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

    /**
     * Deactivate a project and return the inactive project
     * @param id Project identification
     * @return Project
     */
    async disable(id: number): Promise<Project> {
        const project = await this.findOne(id);

        return this.projectRepository.save({ ...project, active: false });
    }
}
