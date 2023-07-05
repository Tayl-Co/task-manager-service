import { Test, TestingModule } from '@nestjs/testing';
import { LabelService } from './label.service';
import { Equal, ILike, In, Repository } from 'typeorm';
import { Label } from '@label/entity/label.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '@src/common/enums/order.enum';

describe('LabelService', () => {
    let service: LabelService;
    let labelRepository: Repository<Label>;
    let labelRepositoryToken = getRepositoryToken(Label);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LabelService,
                {
                    provide: labelRepositoryToken,
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<LabelService>(LabelService);
        labelRepository = module.get<Repository<Label>>(labelRepositoryToken);
    });

    const label = {
        name: 'Feature',
        color: '#fff',
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should return an error message if label already exist', async () => {
            jest.spyOn(labelRepository, 'findOne').mockImplementation(() =>
                Promise.resolve({
                    id: 1,
                    ...label,
                }),
            );

            await expect(service.create(label)).rejects.toThrow(
                `The Feature Label already exists`,
            );

            expect(labelRepository.findOne).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOne).toHaveBeenCalledWith({
                where: { name: Equal(label.name) },
            });
        });

        it('should create a new label', async () => {
            const newLabel = {
                id: 1,
                ...label,
            };
            jest.spyOn(labelRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(labelRepository, 'create').mockImplementation(
                () => newLabel,
            );
            jest.spyOn(labelRepository, 'save').mockImplementation(() =>
                Promise.resolve(newLabel),
            );

            await service.create(label);

            expect(labelRepository.findOne).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOne).toHaveBeenCalledWith({
                where: { name: Equal(label.name) },
            });
            expect(labelRepository.create).toHaveBeenCalledTimes(1);
            expect(labelRepository.create).toHaveBeenCalledWith(label);
            expect(labelRepository.save).toHaveBeenCalledTimes(1);
            expect(labelRepository.save).toHaveBeenCalledWith(newLabel);
        });
    });

    describe('findOne', () => {
        it('should return an error message if label not found', async () => {
            const id = 6;
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.findOne(id)).rejects.toThrow(
                `Label ${id} not found`,
            );

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
        });

        it('should return a label', async () => {
            const id = 1;
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve({ id, ...label }),
            );
            const response = await service.findOne(id);

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
            expect(response).toMatchObject({ id, ...label });
        });
    });

    describe('delete', () => {
        it('should return an error message if label not found', async () => {
            const id = 2;
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(labelRepository, 'delete').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.findOne(id)).rejects.toThrow(
                `Label ${id} not found`,
            );

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
            expect(labelRepository.delete).toHaveBeenCalledTimes(0);
            expect(labelRepository.delete).not.toHaveBeenCalled();
        });

        it('should delete the label', async () => {
            const id = 2;
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve({ id, ...label }),
            );
            jest.spyOn(labelRepository, 'delete').mockImplementation(() =>
                Promise.resolve({ raw: [], affected: 1 }),
            );

            const response = await service.delete(id);

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
            expect(labelRepository.delete).toHaveBeenCalledTimes(1);
            expect(labelRepository.delete).toHaveBeenCalledWith(id);
            expect(response).toMatchObject({ id, ...label });
        });
    });

    describe('update', () => {
        const id = 2;
        it('should return an error message if label not found', async () => {
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(labelRepository, 'save').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.update(id, label)).rejects.toThrow(
                `Label ${id} not found`,
            );

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
            expect(labelRepository.save).toHaveBeenCalledTimes(0);
            expect(labelRepository.save).not.toHaveBeenCalled();
        });

        it('should return an updated label', async () => {
            const updatedLabel = { id, ...label, name: 'Feature 2' };
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve({ id, ...label }),
            );
            jest.spyOn(labelRepository, 'save').mockImplementation(() =>
                Promise.resolve(updatedLabel),
            );

            const response = await service.update(id, {
                color: updatedLabel.color,
                name: updatedLabel.name,
            });

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
            expect(labelRepository.save).toHaveBeenCalledTimes(1);
            expect(labelRepository.save).toHaveBeenCalledWith(updatedLabel);
            expect(response).toMatchObject(updatedLabel);
        });
    });

    describe('search', () => {
        const pagination = { limit: 10, page: 1 };

        it('should search by ids', async () => {
            const ids = [1, 2];
            jest.spyOn(labelRepository, 'find').mockImplementation(() =>
                Promise.resolve([]),
            );

            await service.search({ ids });

            expect(labelRepository.find).toHaveBeenCalledTimes(1);
            expect(labelRepository.find).toHaveBeenCalledWith({
                where: { id: In(ids) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });

        it('should search by name', async () => {
            const name = 'Feature';
            jest.spyOn(labelRepository, 'find').mockImplementation(() =>
                Promise.resolve([]),
            );

            await service.search({ name });

            expect(labelRepository.find).toHaveBeenCalledTimes(1);
            expect(labelRepository.find).toHaveBeenCalledWith({
                where: { name: ILike(`%${name}%`) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });

        it('should search by color', async () => {
            const color = '#fff';
            jest.spyOn(labelRepository, 'find').mockImplementation(() =>
                Promise.resolve([]),
            );

            await service.search({ color });

            expect(labelRepository.find).toHaveBeenCalledTimes(1);
            expect(labelRepository.find).toHaveBeenCalledWith({
                where: { color: ILike(`%${color}%`) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });

        it('should search by page and by limit', async () => {
            jest.spyOn(labelRepository, 'find').mockImplementation(() =>
                Promise.resolve([]),
            );

            await service.search(pagination);

            expect(labelRepository.find).toHaveBeenCalledTimes(1);
            expect(labelRepository.find).toHaveBeenCalledWith({
                where: {},
                order: { name: Order.ASC },
                take: pagination.limit,
                skip: pagination.page * pagination.limit,
            });
        });
        it('should search by page', async () => {
            jest.spyOn(labelRepository, 'find').mockImplementation(() =>
                Promise.resolve([]),
            );

            await service.search({ page: pagination.page });

            expect(labelRepository.find).toHaveBeenCalledTimes(1);
            expect(labelRepository.find).toHaveBeenCalledWith({
                where: {},
                order: { name: Order.ASC },
                take: undefined,
                skip: pagination.page,
            });
        });
        it('should search by limit', async () => {
            jest.spyOn(labelRepository, 'find').mockImplementation(() =>
                Promise.resolve([]),
            );

            await service.search({ limit: pagination.limit });

            expect(labelRepository.find).toHaveBeenCalledTimes(1);
            expect(labelRepository.find).toHaveBeenCalledWith({
                where: {},
                order: { name: Order.ASC },
                take: pagination.limit,
                skip: 0,
            });
        });
        it('should add order in search', async () => {
            const order = { orderBy: 'color', sortOrder: 'ASC' };
            jest.spyOn(labelRepository, 'find').mockImplementation(() =>
                Promise.resolve([]),
            );

            await service.search(order);

            expect(labelRepository.find).toHaveBeenCalledTimes(1);
            expect(labelRepository.find).toHaveBeenCalledWith({
                where: {},
                order: { [order.orderBy]: order.sortOrder },
                take: undefined,
                skip: 0,
            });
        });
    });
});
