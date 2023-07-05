import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsOrderValue, ILike, In, Repository } from 'typeorm';
import { Label } from '@label/entity/label.entity';
import { LabelDto } from '@label/dtos/label.dto';
import { SearchLabelDto } from '@label/dtos/searchLabel.dto';
import { Order } from '@src/common/enums/order.enum';

@Injectable()
export class LabelService {
    constructor(
        @InjectRepository(Label) private labelRepository: Repository<Label>,
    ) {}

    async create(labelInput: LabelDto): Promise<Label> {
        const label = await this.labelRepository.findOne({
            where: { name: Equal(labelInput.name) },
        });

        if (label)
            throw new ConflictException(
                `The ${label.name} Label already exists`,
            );

        const newLabel = this.labelRepository.create(labelInput);

        return this.labelRepository.save(newLabel);
    }

    async findOne(id: number): Promise<Label> {
        const label = await this.labelRepository.findOneBy({ id });

        if (!label) throw new NotFoundException(`Label ${id} not found`);

        return label;
    }

    async delete(id: number): Promise<Label> {
        const label = await this.findOne(id);
        await this.labelRepository.delete(id);

        return label;
    }

    async update(id: number, labelInput: LabelDto): Promise<Label> {
        const label = await this.findOne(id);
        Object.assign(label, labelInput);

        return this.labelRepository.save(label);
    }

    search(searchInput: SearchLabelDto): Promise<Array<Label>> {
        const {
            ids,
            name,
            color,
            limit,
            sortOrder = Order.ASC,
            orderBy = 'name',
            page = 0,
        } = searchInput;
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (name) where = { ...where, name: ILike(`%${name}%`) };

        if (color) where = { ...where, color: ILike(`%${color}%`) };

        return this.labelRepository.find({
            where,
            order: { [orderBy]: sortOrder as FindOptionsOrderValue },
            take: limit || undefined,
            skip: limit ? page * limit : page,
        });
    }
}
