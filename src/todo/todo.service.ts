import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ToDoRepository } from '@todo/repository/todo.repository';
import { ToDo } from '@todo/entity/todo.entity';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import { ProjectService } from '@project/project.service';
import { Project } from '@project/entity/project.entity';
import { CreateReferenceDto } from '@todo/dtos/createReference.dto';

@Injectable()
export class TodoService {
    constructor(
        private todoRepository: ToDoRepository,
        private projectService: ProjectService,
    ) {}

    async create(todoInput: CreateToDoDto): Promise<ToDo> {
        const { projectId } = todoInput;
        let project: Project | null = null;

        if (projectId) {
            project = await this.projectService.findOne(projectId);
        }

        return this.todoRepository.create(todoInput, project);
    }

    async findAll(): Promise<Array<ToDo>> {
        return await this.todoRepository.findAll();
    }

    async findOne(id: number): Promise<ToDo> {
        const todo = await this.todoRepository.findOne(id);

        if (!todo) throw new NotFoundException(`ToDo ${id} not found`);

        return todo;
    }

    async remove(id: number): Promise<ToDo> {
        const todo = await this.findOne(id);

        return await this.todoRepository.remove(todo);
    }

    async addReference(
        id: number,
        referenceInput: CreateReferenceDto,
    ): Promise<ToDo> {
        const todo = await this.findOne(id);
        const reference = todo.references.find(
            e => e.key === referenceInput.key,
        );

        if (reference) throw new ConflictException(`Reference already exists`);

        return await this.todoRepository.addReference(todo, referenceInput);
    }
}
