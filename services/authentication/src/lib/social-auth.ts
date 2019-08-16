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
        fields: 'id,name,email,picture',
      },
      uri: 'https://graph.facebook.com/v2.11/me',
    };
    const response = await rp(options);

    if (response.email) {
      return Promise.reject({
        message: 'Failed to retrieve email',
      });
    }

    return {
      avatar: response.picture &&
        response.picture.data &&
        response.picture.data.url,
      display_name: response.name,
      email: response.email,
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

    const email = Array.isArray(response.emails) && response.emails.length > 0
      ? response.emails.find((addr: {
        value: string,
        type: string,
      }) => addr.type === 'account')
      : null;

    if (!email) {
      return Promise.reject({
        message: 'Failed to retrieve email',
      });
    }

    return {
      avatar: response.image.url,
      display_name: response.displayName,
      email,
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

    if (!response.kaccount_email) {
      return Promise.reject({
        message: 'Failed to retrieve email',
      });
    }

    return {
      avatar: response.properties && response.properties.profile_image,
      display_name: response.properties && response.properties.nickname,
      email: response.kaccount_email,
      social_id: String(response.id),
      social_token: accessToken,
      strategy: SocialAuthProviders.kakao,
    };
  }
}

export const socialAuth = new SocialAuth();
