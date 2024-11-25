import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VendorService } from './vendor.service';
import { VendorEntity } from './vendor.entity'; // MySQL entity for Vendor

@Resolver(() => VendorEntity)
export class VendorResolver {
  constructor(private readonly vendorService: VendorService) {}

  @Query(() => [VendorEntity])
  async getAllVendors(): Promise<VendorEntity[]> {
    return this.vendorService.getAllVendors();
  }

  @Query(() => VendorEntity)
  async getVendorById(
    @Args('vendor_id') vendor_id: string,
  ): Promise<VendorEntity> {
    return this.vendorService.getVendorById(vendor_id);
  }

  @Mutation(() => VendorEntity)
  async createVendor(
    @Args('vendor_name') vendor_name: string,
    @Args('vendor_type') vendor_type: string,
    @Args('webhook_url') webhook_url: string,
    @Args('no_of_request_per_sec') no_of_request_per_sec: number,
  ): Promise<VendorEntity> {
    return this.vendorService.createVendor({
      vendor_name,
      vendor_type,
      webhook_url,
      no_of_request_per_sec,
    });
  }

  @Mutation(() => VendorEntity)
  async updateVendor(
    @Args('vendor_id') vendor_id: string,
    @Args('vendor_name', { nullable: true }) vendor_name?: string,
    @Args('vendor_type', { nullable: true }) vendor_type?: string,
    @Args('webhook_url', { nullable: true }) webhook_url?: string,
    @Args('no_of_request_per_sec', { nullable: true })
    no_of_request_per_sec?: number,
    @Args('failed_request_count', { nullable: true })
    failed_request_count?: number,
  ): Promise<VendorEntity> {
    return this.vendorService.updateVendor(vendor_id, {
      vendor_name,
      vendor_type,
      webhook_url,
      no_of_request_per_sec,
      failed_request_count,
    });
  }
}
