import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from './vendor.entity'; // MySQL entity for Vendor

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
  ) {}

  async getAllVendors(): Promise<VendorEntity[]> {
    return this.vendorRepository.find();
  }

  async getVendorById(vendor_id: string): Promise<VendorEntity> {
    const vendor = await this.vendorRepository.findOne({
      where: { vendor_id },
    });
    if (!vendor) {
      throw new Error(`Vendor with ID ${vendor_id} not found.`);
    }
    return vendor;
  }

  async createVendor(vendorData: Partial<VendorEntity>): Promise<VendorEntity> {
    const newVendor = this.vendorRepository.create(vendorData);
    return this.vendorRepository.save(newVendor);
  }

  async updateVendor(
    vendor_id: string,
    updateData: Partial<VendorEntity>,
  ): Promise<VendorEntity> {
    const vendor = await this.getVendorById(vendor_id);
    const updatedVendor = Object.assign(vendor, updateData);
    return this.vendorRepository.save(updatedVendor);
  }
}
