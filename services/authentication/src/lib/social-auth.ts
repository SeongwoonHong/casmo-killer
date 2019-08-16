import * as rp from 'request-promise';

import {
  SocialAuthProviders,
  SocialAuthResponse,
} from '~lib/types';
import { configs } from '~config';

const {
  AUTH_STRATEGIES: strategies,
} = configs;

class SocialAuth {
  public strategies: SocialAuthProviders[];

  constructor() {
    this.strategies = strategies.filter((strategy) => {
      return strategy !== 'local';
    });
  }

  public fetchSocialInfo(
    strategy: SocialAuthProviders,
    accessToken: string,
  ): Promise<SocialAuthResponse> {
    return this.strategies.includes(strategy)
      ? this[strategy](accessToken)
      : Promise.reject({
        message: `${strategy} is not a valid social provider.`,
      });
  }

  public async facebook(accessToken: string): Promise<SocialAuthResponse> {
    const options = {
      json: true,
      method: 'GET',
      qs: {
        access_token: accessToken,
        fields: 'id,name,picture',
      },
      uri: 'https://graph.facebook.com/v2.11/me',
    };
    const response = await rp(options);

    if (response.id) {
      return Promise.reject({
        message: 'Failed to retrieve profile',
      });
    }

    return {
      avatar: response.picture &&
        response.picture.data &&
        response.picture.data.url,
      display_name: response.name,
      social_id: response.id,
      social_token: accessToken,
      strategy: SocialAuthProviders.facebook,
    };
  }

  public async google(accessToken: string): Promise<SocialAuthResponse> {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: true,
      method: 'GET',
      uri: 'https://www.googleapis.com/plus/v1/people/me',
    };
    const response = await rp(options);

    if (response.id) {
      return Promise.reject({
        message: 'Failed to retrieve profile',
      });
    }

    return {
      avatar: response.image.url,
      display_name: response.displayName,
      social_id: response.id,
      social_token: accessToken,
      strategy: SocialAuthProviders.google,
    };
  }

  public async kakao(accessToken: string): Promise<SocialAuthResponse> {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: true,
      method: 'GET',
      uri: 'https://kapi.kakao.com/v1/user/me',
    };
    const response = await rp(options);

    if (response.id) {
      return Promise.reject({
        message: 'Failed to retrieve profile',
      });
    }

    return {
      avatar: response.properties && response.properties.profile_image,
      display_name: response.properties && response.properties.nickname,
      social_id: String(response.id),
      social_token: accessToken,
      strategy: SocialAuthProviders.kakao,
    };
  }
}

export const socialAuth = new SocialAuth();
