import { InjectionToken } from '@angular/core';
import { IGameService } from './interfaces/game.service.interface';
import { IUserService } from './interfaces/user.service.interface';
import { IAuthService } from './interfaces/auth.service.interface';

export const GAME_SERVICE_TOKEN = new InjectionToken<IGameService>('Game.Service');
export const USER_SERVICE_TOKEN = new InjectionToken<IUserService>('User.Service');
export const AUTH_SERVICE_TOKEN = new InjectionToken<IAuthService>('Auth.Service');
