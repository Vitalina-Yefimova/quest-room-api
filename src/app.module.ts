import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { EmailModule } from './email/email.module';
import { FavoritesModule } from './favorites/favorites.module';
import { OrdersModule } from './orders/orders.module';
import { QuestsModule } from './quests/quests.module';
import { UsersModule } from './users/users.module';
import { MONGODB_URI } from './utils/config';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(MONGODB_URI),
    QuestsModule,
    OrdersModule,
    FavoritesModule,
    UsersModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
