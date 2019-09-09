import { AuthClient, IAuthSettings } from '../src';

describe('authclient', () => {
  it('generates correct url', () => {
    let authClient = new AuthClient("authorizationCodeClient", "mysecret", "http://localhost:5436/account/oAuth2");
    let authOptions : IAuthSettings = {
      scope : ['userinfo', 'accounts', 'balance', 'transactions'],
      nonce: 'hello',
      state: 'world'
    }

    const expected: string = "https://auth.bankengine.nz/connect/authorize/callback?response_type=code&client_id=authorizationCodeClient&redirect_uri=http://localhost:5436/account/oAuth2&scope=userinfo%20accounts%20balance%20transactions&nonce=hello&state=world";

    expect(authClient.generateAuthorizationURL(authOptions)).toBe(expected)
  });
});
