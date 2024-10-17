import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) { }

  // Create Variant
  @Post()
  create(@Body() createVariantDto: CreateVariantDto) {
    console.log(createVariantDto)
    return this.variantService.create(createVariantDto);
  }

  // Get All Variants
  @Get()
  findAll() {
    return this.variantService.getAll();
  }

  // Get One Variant
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantService.findOne(id);
  }

  // Variant By Product
  @Get('product/:id')
  getVariantsByProductId(@Param('id') id: string) {
    return this.variantService.getVariantsByProductId(id);
  }

  // Update Variant
  @Put(':id')
  update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantService.update(id, updateVariantDto);
  }

  // Delete Variant
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantService.remove(id);
  }
}
