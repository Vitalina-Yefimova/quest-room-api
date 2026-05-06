import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { Quests, QuestsDocument } from '../mongo-schemas/quests.schema';
import { OrdersRequest, OrdersResponse, OrderStatus } from './interfaces';

@Injectable()
export class OrdersDataService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(Quests.name) private readonly questsModel: Model<QuestsDocument>,
  ) { }

  async create(data: OrdersRequest): Promise<OrdersResponse> {
    const quest = await this.questsModel.findById(data.questId);
    if (!quest) throw new NotFoundException('Quest not found.');

    const order = await this.prisma.orders.create({
      data: {
        user: { connect: { id: data.userId } },
        questId: data.questId,
        date: data.date,
        participants: data.participants,
        price: quest.price,
      },
    });
    return { ...order, status: (order as any).status as OrderStatus };
  }

  async findOrders(where: any): Promise<OrdersResponse[]> {
    const orders = await this.prisma.orders.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      orders.map(async (order) => {
        const quest = await this.questsModel.findById(order.questId);
        return {
          ...order,
          questTitle: quest?.title || 'Unknown Quest',
          questId: order.questId,
          status: (order as any).status as OrderStatus
        };
      }),
    );
  }

  async findById(id: number): Promise<OrdersResponse | null> {
    const order = await this.prisma.orders.findUnique({
      where: { id },
    });
    return order ? { ...order, status: (order as any).status as OrderStatus } : null;
  }

  async update(
    id: number,
    data: { date?: Date; participants?: number; status?: OrderStatus },
  ): Promise<OrdersResponse> {
    const order = await this.prisma.orders.update({
      where: { id },
      data,
    });
    return { ...order, status: (order as any).status as OrderStatus };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.orders.delete({ where: { id } });
  }
}
