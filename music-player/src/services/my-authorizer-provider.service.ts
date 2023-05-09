import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';

//Not finalized Yet
export class MyAuthorizationProvider implements Provider<Authorizer> {
  constructor() {}

  // /**
  //  * @returns authenticateFn
  //  */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    return AuthorizationDecision.ALLOW;
  }
}
