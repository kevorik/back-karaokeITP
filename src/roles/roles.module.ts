import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import RoleSchema from 'src/schemas/role.schema';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Role', schema: RoleSchema },
    ]),
  ],
})
export class RolesModule {}