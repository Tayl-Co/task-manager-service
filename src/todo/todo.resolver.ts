import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoService } from '@todo/todo.service';
import { ToDo } from '@todo/entity/todo.entity';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import { UpdateTodoDto } from '@todo/dtos/updateTodo.dto';
import { SearchTodoDto } from '@todo/dtos/searchTodo.dto';

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
    async delete(@Args('id', { type: () => Int }) id: number): Promise<ToDo> {
        return await this.todoService.delete(id);
    }

    @Mutation(() => ToDo, { name: 'updateToDo' })
    async update(
        @Args('id', { type: () => Int }) id: number,
        @Args('todoInput', { type: () => UpdateTodoDto })
        todoInput: UpdateTodoDto,
    ): Promise<ToDo> {
        return await this.todoService.update(id, todoInput);
    }

    @Mutation(() => ToDo, { name: 'addToDoLabel' })
    async addLabel(
        @Args('id', { type: () => Int }) id: number,
        @Args('labelId', { type: () => Int }) labelId: number,
    ): Promise<ToDo> {
        return await this.todoService.addLabel(id, labelId);
    }

    @Mutation(() => ToDo, { name: 'removeToDoLabel' })
    async removeLabel(
        @Args('id', { type: () => Int }) id: number,
        @Args('labelId', { type: () => Int }) labelId: number,
    ): Promise<ToDo> {
        return await this.todoService.removeLabel(id, labelId);
    }

    @Mutation(() => ToDo, { name: 'addToDoAssignee' })
    async addAssignee(
        @Args('id', { type: () => Int }) id: number,
        @Args('assigneeId', { type: () => String }) assigneeId: string,
    ): Promise<ToDo> {
        return await this.todoService.addAssignee(id, assigneeId);
    }

    @Mutation(() => ToDo, { name: 'removeToDoAssignee' })
    async removeAssignee(
        @Args('id', { type: () => Int }) id: number,
        @Args('assigneeId', { type: () => String }) assigneeId: string,
    ): Promise<ToDo> {
        return await this.todoService.removeAssignee(id, assigneeId);
    }

    @Query(() => [ToDo], { name: 'findAllToDo' })
    async findAll(): Promise<Array<ToDo>> {
        return await this.todoService.findAll();
    }

    @Query(() => ToDo, { name: 'findOneToDo' })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<ToDo> {
        return await this.todoService.findOne(id);
    }

    @Query(() => [ToDo], { name: 'searchToDo' })
    async search(
        @Args('searchInput', { type: () => SearchTodoDto })
        searchInput: SearchTodoDto,
    ): Promise<Array<ToDo>> {
        return await this.todoService.search(searchInput);
    }
}
