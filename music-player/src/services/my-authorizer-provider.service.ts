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
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    const userRole = authorizationCtx.principals[0].userType;
    const allowedRoles = <string[]>metadata.allowedRoles;
    let checkRole = true;
    if (allowedRoles.includes(userRole)) {
      checkRole = true;
    } else {
      checkRole = false;
    }
    return checkRole ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
  }
}
