import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import {ActiveUser} from "../iam/decorators/active-user.decorator";
import {ActiveUserData} from "../iam/interfaces/active-user-data.interface";
import {Role} from "../users/enums/role.enum";
import {Roles, ROLES_KEY} from "../iam/authorization/decorators/role.decorator";
import {Policies} from "../iam/decorators/policies.decorator";
import {FrameworkContributorPolicy} from "../iam/authorization/policies/framework-contributor.policy";

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  //@Roles(Role.Admin)
  @Policies(
      new FrameworkContributorPolicy(),  /** new MinAgePolicy(18), new OnlyAdminPolicy() */
  )
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    console.log(user);
    return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(+id, updateCoffeeDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(+id);
  }
}
