import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsModule } from './quests/quests.module';
import { OrdersModule } from './orders/orders.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { FavoritesModule } from './favorites/favorites.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { MONGO_URI } from './utils/config';


@Module({
  imports: [AuthModule, MongooseModule.forRoot(MONGO_URI), QuestsModule, OrdersModule, FavoritesModule, UsersModule, EmailModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],

})
export class AppModule { }
