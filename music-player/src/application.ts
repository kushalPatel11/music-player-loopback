import {
  AuthenticationBindings,
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {TokenServiceBindings, TokenServiceConstants} from './keys';
import {MySequence} from './sequence';
import {JWTAuthenticationStrategy} from './services/authentication/jwt.auth.strategy';
import {JWTService} from './services/authentication/jwt.service';
import {SecuritySpecEnhancer} from './services/authentication/security.spec.enhancer';
import {AuthorizationOptions, AuthorizationDecision, AuthorizationComponent, AuthorizationTags} from '@loopback/authorization';
import {MyAuthorizationProvider} from './services/my-authorizer-provider.service';

export {ApplicationConfig};

export class MusicPlayerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.configure(AuthenticationBindings.COMPONENT).to({
      defaultMetadata: {strategy: 'jwt'},
    });

    // Mount authentication system
    this.component(AuthenticationComponent);

    // Mount jwt component
    this.add(createBindingFromClass(SecuritySpecEnhancer));

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    const authorizationOptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };

    const binding = this.component(AuthorizationComponent);
    this.configure(binding.key).to(authorizationOptions);

    this.bind('authorizationProviders.my-authorizer-provider')
      .toProvider(MyAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);
  }
}
