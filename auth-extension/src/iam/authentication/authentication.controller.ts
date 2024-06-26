import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {SignUpDto} from "./dto/sign-up.dto";
import {SignInDto} from "./dto/sign-in.dto";
import {Auth} from "./decorators/auth.decorator";
import {AuthType} from "../enums/auth-type.enum";
import {RefreshTokenDto} from "./dto/refresh-token.dto";

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
    constructor( private  readonly authService: AuthenticationService ) {}

    @Post('sign-up')
    signUp(@Body() body: SignUpDto) {
        return this.authService.signUp(body);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    signIn(@Body() body: SignInDto) {
        return this.authService.signIn(body);
    }

    @HttpCode(HttpStatus.OK) // changed since the default is 201
    @Post('refresh-tokens')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto);
    }
}
