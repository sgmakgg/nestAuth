import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";
import {Role} from "../../../../users/enums/role.enum";
import {ROLES_KEY} from "../../decorators/role.decorator";
import {ActiveUserData} from "../../../interfaces/active-user-data.interface";
import {REQUEST_USER_KEY} from "../../../iam.constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);
    console.log(contextRoles);

    if(!contextRoles){
      return true;
    }

    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    console.log({user});

    return contextRoles.some((role) => user.role === role);
  }
}
