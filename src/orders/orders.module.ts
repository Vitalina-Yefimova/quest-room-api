import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersDataService } from './orders-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Quests, QuestsSchema } from '../mongo-schemas/quests.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quests.name, schema: QuestsSchema }])
  ],
  providers: [OrdersService, OrdersDataService, PrismaService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule { }
