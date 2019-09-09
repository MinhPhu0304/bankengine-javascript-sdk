
export interface IAuthSettings {
  scope: string[];
  nonce: string;
  state?: string;
}

export interface ITokenResponse {
  access_token: string;
  refresh_token: string;
}

import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

export class AuthClient {
  private readonly _authBaseUrl: string = "https://auth.bankengine.nz"
  private readonly _clientId: string;
  private readonly _clientSecret: string;
  private readonly _redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string, authBaseUrl?: string) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._redirectUri = redirectUri;
    if (authBaseUrl) {
      this._authBaseUrl = authBaseUrl;
    }
  }

  public generateAuthorizationURL(authSettings: IAuthSettings): string {
    const scopes: string = authSettings.scope.join(" ");
    let url: string =
      `${this._authBaseUrl}/connect/authorize/callback?` +
      `response_type=code&` +
      `client_id=${this._clientId}&` +
      `redirect_uri=${this._redirectUri}&` +
      `scope=${scopes}&` +
      `nonce=${authSettings.nonce}`;

    if (authSettings.state) {
      url += `&state=${authSettings.state}`;
    }

    return encodeURI(url);
  }

  public async exchangeToken(code: string): Promise<ITokenResponse> {
    const options = {
      grant_type: "authorization_code",
      client_id: this._clientId,
      client_secret: this._clientSecret,
      redirect_uri: this._redirectUri,
      code
    }

    return await this.callTokenEndpoint(options);
  }

  public async refreshToken(refreshToken: string): Promise<ITokenResponse> {
    const options = {
      grant_type: "refresh_token",
      client_id: this._clientId,
      refresh_token: refreshToken
    }
    return await this.callTokenEndpoint(options);
  }

  private async callTokenEndpoint(options: any) {
    const request: AxiosRequestConfig = {
      baseURL: this._authBaseUrl,
      url: "/connect/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: qs.stringify(options)
    };
    const resp = await axios(request);
    const json = JSON.parse(resp.data);
    return {
      access_token: json.access_token,
      refresh_token: json.refresh_token
    };
  }
}