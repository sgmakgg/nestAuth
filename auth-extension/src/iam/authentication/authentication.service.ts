import {ConflictException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../users/entities/user.entity";
import {Repository} from "typeorm";
import {HashingService} from "../hashing/hashing.service";
import {SignUpDto} from "./dto/sign-up.dto";
import {SignInDto} from "./dto/sign-in.dto";
import {JwtService} from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import JwtConfig from "../config/jwt.config";
import {ConfigType} from "@nestjs/config";

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
    ) {}

    async signUp(signupDto: SignUpDto) {
        try {
            const user = new User();
            user.email = signupDto.email;
            user.password = await this.hashingService.hash(signupDto.password);

            await this.userRepository.save(user);
        }
        catch (err){
            const pgUniqueViolationErrorCode = '23505';
            if (err.code === pgUniqueViolationErrorCode) {
                throw new ConflictException();
            }
            throw err;
        }
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.userRepository.findOneBy(
            { email: signInDto.email },
        );

        if(!user){
            throw new UnauthorizedException('User does not exists');
        }

        const isEqual = await this.hashingService.compare(
            signInDto.password,
            user.password,
        );

        if (!isEqual) {
            throw new UnauthorizedException('Password does not match');
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.accessTokenTtl,
            },
        );
        return {
            accessToken,
        };
    }
}
