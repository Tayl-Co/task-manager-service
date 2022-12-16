import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoService } from '@todo/todo.service';
import { ToDo } from '@todo/entity/todo.entity';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import { CreateReferenceDto } from '@todo/dtos/createReference.dto';

@Resolver()
export class TodoResolver {
    constructor(private todoService: TodoService) {}

    @Mutation(() => ToDo, { name: 'createToDo' })
    async create(
        @Args('todoInput', { type: () => CreateToDoDto })
        todoInput: CreateToDoDto,
    ): Promise<ToDo> {
        return await this.todoService.create(todoInput);
    }

    @Mutation(() => ToDo, { name: 'deleteToDo' })
    async remove(@Args('id', { type: () => Int }) id: number): Promise<ToDo> {
        return await this.todoService.remove(id);
    }

    @Mutation(() => ToDo, { name: 'addReference' })
    async addReference(
        @Args('id') id: number,
        @Args('referenceInput') referenceInput: CreateReferenceDto,
    ): Promise<ToDo> {
        return await this.todoService.addReference(id, referenceInput);
    }

    @Query(() => [ToDo], { name: 'findAll' })
    async findAll(): Promise<Array<ToDo>> {
        return await this.todoService.findAll();
    }

    @Query(() => ToDo, { name: 'findOneToDo' })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<ToDo> {
        return await this.todoService.findOne(id);
    }
}
