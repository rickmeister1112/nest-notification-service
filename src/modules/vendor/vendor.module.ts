import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './vendor.entity';
import { VendorService } from './vendor.service';
import { VendorResolver } from './vendor.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])],
  providers: [VendorService, VendorResolver],
  exports: [VendorService],
})
export class VendorModule {}
