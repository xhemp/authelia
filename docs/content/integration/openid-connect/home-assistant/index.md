---
title: "Home Assistant"
description: "Integrating Home Assistant with the Authelia OpenID Connect 1.0 Provider."
summary: ""
date: 2022-06-15T17:51:47+10:00
draft: false
images: []
weight: 620
toc: true
support:
  level: community
  versions: true
  integration: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

## Tested Versions

* [Authelia]
  * [v4.39.1](https://github.com/authelia/authelia/releases/tag/v4.39.1)
* [Home Assistant]
  * Application:
    * [2025-4-2](https://github.com/home-assistant/core/releases/tag/2025.4.2)
  * Integration:
    * [v0.6.2-alpha](https://github.com/christiaangoossens/hass-oidc-auth/releases/tag/v0.6.2-alpha)

{{% oidc-common %}}

### Assumptions

This example makes the following assumptions:

* __Application Root URL:__ `https://home-assistant.{{< sitevar name="domain" nojs="example.com" >}}/`
* __Authelia Root URL:__ `https://{{< sitevar name="subdomain-authelia" nojs="auth" >}}.{{< sitevar name="domain" nojs="example.com" >}}/`
* __Client ID:__ `home-assistant`
* __Client Secret:__ `insecure_secret`

Some of the values presented in this guide can automatically be replaced with documentation variables.

{{< sitevar-preferences >}}

## Configuration

### Authelia

The following YAML configuration is an example __Authelia__ [client configuration] for use with [Home Assistant] which will
operate with the application example:

```yaml {title="configuration.yml"}
identity_providers:
  oidc:
    ## The other portions of the mandatory OpenID Connect 1.0 configuration go here.
    ## See: https://www.authelia.com/c/oidc
    clients:
      - client_id: 'home-assistant'
        client_name: 'Home Assistant'
        client_secret: '$pbkdf2-sha512$310000$c8p78n7pUMln0jzvd4aK4Q$JNRBzwAo0ek5qKn50cFzzvE9RXV88h1wJn5KGiHrD0YKtZaR/nCb2CJPOsKaPK0hjf.9yHxzQGZziziccp6Yng'  # The digest of 'insecure_secret'.
        public: false
        require_pkce: true
        pkce_challenge_method: 'S256'
        authorization_policy: 'two_factor'
        redirect_uris:
          - 'https://home-assistant.{{< sitevar name="domain" nojs="example.com" >}}/auth/oidc/callback'
        scopes:
          - 'openid'
          - 'profile'
          - 'groups'
        id_token_signed_response_alg: 'none'
```

### Application

To configure [Home Assistant] to utilize Authelia as an [OpenID Connect 1.0] Provider it must be done via a third party
integration.

1. Add the [https://github.com/christiaangoossens/hass-oidc-auth](https://github.com/christiaangoossens/hass-oidc-auth) repository via [HACS](https://hacs.xyz/)
2. Add the following to your [Home Assistant] `configuration.yml`:

```yaml
auth_oidc:
  client_id: 'home-assistant'
  client_secret: 'insecure_secret'
  discovery_url: 'https://{{< sitevar name="subdomain-authelia" nojs="auth" >}}.{{< sitevar name="domain" nojs="example.com" >}}/.well-known/openid-configuration'
  display_name: 'Authelia'
  roles:
    admin: 'admins'
```

## See Also

- [Home Assistant OpenID Connect Auth Integration Docs](https://github.com/christiaangoossens/hass-oidc-auth)

[Home Assistant]: https://www.home-assistant.io/
[Authelia]: https://www.authelia.com
[OpenID Connect 1.0]: ../../openid-connect/introduction.md
[client configuration]: ../../../configuration/identity-providers/openid-connect/clients.md
