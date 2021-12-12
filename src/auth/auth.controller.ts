import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { GoogleGuard } from './guards/google.guard'
import { FacebookGuard } from './guards/facebook.guard'
import { ConfigService } from '@nestjs/config'

const MAX_AGE = 30 * 24 * 60 * 60 * 1000 // 30 days

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('facebook')
  @UseGuards(FacebookGuard)
  async facebookLogin(): Promise<HttpStatus> {
    return HttpStatus.OK
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleLogin(): Promise<HttpStatus> {
    return HttpStatus.OK
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req, @Res() res): Promise<any> {
    this.responsePayload(req, res)
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookGuard)
  async facebookLoginRedirect(@Req() req, @Res() res): Promise<any> {
    this.responsePayload(req, res)
  }

  @Get('activate/:hash')
  activate(@Param() params) {
    console.log(params.hash)
    return this.authService.activate(params.hash)
  }

  private responsePayload(req, res) {
    this.authService.socialLogin(req).then((result) => {
      res.cookie('refreshToken', result.user.refreshToken.token, {
        age: this.config.get<string>('JWT_REFRESH_EXPIRES_IN'),
        httpOnly: true,
      })
      res.status(HttpStatus.ACCEPTED).json({
        user: result.user.user,
        accessToken: result.user.accessToken,
      })
    })
  }
}
