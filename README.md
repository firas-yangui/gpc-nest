## NestJS whiteApp API producer

[![pipeline](https://img.shields.io/badge/pipeline-passed-gray74)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)
[![coverage report](https://img.shields.io/badge/coverage-91.09-yellow)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)
[![openshift](https://img.shields.io/badge/openshift-deployed-red)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![node](https://img.shields.io/badge/node-v10.16.0-blue)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)
[![typescript](https://img.shields.io/badge/typescript-v3.4.3-BlueViolet)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)
[![scconnect](https://img.shields.io/badge/sgconnect-v0.0.18-red)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)
[![build](https://img.shields.io/badge/build-passed-green)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)

This project is based on DEX, ITEC and FIT standards.
This project use packages from BSC and from ITEC

## Description

This is a basic API back-end based on [NestJS](https://nestjs.com/) framework.

- [ SG | Connect core module](https://sgithub.fr.world.socgen/nestjs/sg-nestjs/blob/master/@sg-nestjs/nestjs-sg-connect/README.md), it provides one controller which is secured with SG Connect through the `@societe-generale/nestjs-sg-connect` module.

- [ SG | Swagger ui core module](https://sgithub.fr.world.socgen/nestjs/sg-nestjs/blob/master/%40sg-nestjs/nestjs-swagger-ui/README.md)

- [Sgwt linter rules](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome)

- [Bsc semantic release](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome)

- [Openshift](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome) support

:information_source: this whiteapp is configured for being [deployed on Openshift](https://nestjs-whiteapp-dev-bsc-api-a2847.hmlogp.dns21.socgen/swagger/)

## Prequisites

- [![node](https://img.shields.io/badge/node-v10.16.0-blue)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)
  [![npm](https://img.shields.io/badge/npm-v6.0.9-green)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)

- :warning: Register [your application](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/register-your-application-sgconnect.md)

- :warning: Get an account for [External NEXUS](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/configure-external-dev-env-for-nodejs-react/get-credentials-for-external-nexus.md) (for **unmanaged laptos**)

- :warning: For **unmanaged laptop**, please the documentation about [How to configure an external dev environment for NodeJS/React](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/configure-external-dev-env-for-nodejs-react/README.md)

- :information_source: [Configure proxy](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/configure-internal-dev-env-for-nodejs-react/configure-http-https-internal-proxy.md) (for **managed laptops**)

- :information_source: Configure NPM

  - for **unmanaged** laptops, please read [this documentation](https://apps.bsc.aws.societegenerale.com/gitlab/dex/frontend/react-whiteapp/blob/develop/README.md#installation)

  - for **managed** laptops, please read [this documentation](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/configure-external-dev-env-for-nodejs-react/configure-npm-get-modules-from-external-nexus.md)

- :information_source: [Read CONTRIBUTING.md](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/blob/develop/CONTRIBUTING.md)

- :information_source: Read the documentation about [Gitlab CI](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/configure-env-variable-inside-gitlabci.md)

- :information_source: Read [SOFA Openshift](https://docs-ui-prod-bsc-dpt-a2742-services.pogp.dns20.socgen/) documentation

## Installation

1. Clone this Sample and change backend_name

    ```bash
    git clone https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp <backend_name>
    ```

2. Bind this project to your target repository on [SGithub](https://sgithub.fr.world.socgen/) or [gitlab](https://apps.bsc.aws.societegenerale.com/gitlab/)

    ```bash
    cd <backend_name>
    rm -rf .git
    git init
    git remote add origin https://<sgithub_or_gitlab_url>/<groupe>/<target_repo_name>.git
    git add .
    git commit -m "chore: initial commit"
    git push -u origin master
    ```

- :warning: For developers who develops on **unmanaged desktop** (outside SG internal network). You must first log in on _exposed nexus_ to be able to get module.

  ```bash
  npm login --registry https://apps.bsc.aws.societegenerale.com/nexus/repository/npm-hosted-fastit/ --scope=@bsc
  ```

- :warning: For developers who develops on **unmanaged desktop**. You must read [Gitlab CI section](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/blob/feature/update-tests/README.md#how-to)

:information_source: Use [NEXUS credentials](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/get-credentials-for-external-nexus.md) (not SAFE or GAIA). Ask to your Tech lead or if your team doesn't have `Nexus account`, ask to SOFA team for creating one for your team.

- On **Internal Desktop** (Windows NDG), add a .npmrc file at the same level of the package.json file with the following

  ```bash
  # Nexus url
  registry=https://cdp-nexus-npm.fr.world.socgen/nexus/repository/sgcib-all-cluster-npm-group/

  # Bsc Registry
  @bsc:registry=https://sofa.dns20.socgen/nexus/repository/fastit-npm-proxy/

  # Sgwt Registry
  @sgwt:registry=https://sofa.dns20.socgen/nexus/repository/fastit-npm-proxy/

  # Node SASS binary configuration parameters
  # see https://github.com/sass/node-sass#binary-configuration-parameters
  sass_binary_site=http://shared-uat.fr.world.socgen/node-sass
  ```

- Setup [SG | Connect configuration](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/register-your-application-sgconnect.md)

* Run the folowing script

  ```bash
  npm install
  ```

## SG|Connect configuration

You must declare the swagger-ui as client application of your API in order to make it works.
For the development environment:
- Register a client application as described in the following [documentation](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/register-your-application-sgconnect.md)
- 


## Usage

### Run the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod

```

#### Developpment environment

- :link: [Swagger URL](http://localhost:9999/swagger/#/)
- :link: [End-point](http://localhost:9999/api/v1/employees)

## Test

[![jest](https://img.shields.io/badge/jest-v24.6.0-brightgreen.svg)](https://jestjs.io/)
[![coverage report](https://img.shields.io/badge/coverage-91.09-yellow)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)

```bash
# unit and e2e tests
npm run test

# unit tests
npm run test:unit

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Linter

Projet uses [eslint](https://eslint.org/) with [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) plugin for linting.

```bash
# linter
npm run lint
```

## Build

```bash
 # build
npm run build
```

## Gitlab CI

### How to

This whiteapp already provides a ready-to-use gitlab ci template `.gitlab-ci.yml` located at the root of the project.

:warning: For unmanged laptop, in order to use Gitlab CI, we need to configure .npmrc and use your Nexus token.

- Get Nexus token

  - :information_source: Read the [documentation](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/get-credentials-for-external-nexus.md)

- Configure Semantic release

  - :information_source: Read semantic [release](https://github.com/semantic-release/semantic-release/blob/master/README.md) docs

  - :information_source: Read [Gitlab CI](https://docs.gitlab.com/ee/ci/README.html) docs

- Configure Gitlab CI

  - :information_source: Configure env [variables](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/configure-env-variable-inside-gitlabci.md)

  - :information_source: How to configure environment variables in gitlab for using them inside your [Gitlab CI](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/configure-env-variable-inside-gitlabci.md)

  - Update .npmrc registry as flowing :

  ```bash
  registry=https://apps.bsc.aws.societegenerale.com/nexus/repository/npm-all/
  //apps.bsc.aws.societegenerale.com/nexus/repository/npm-all/:_authToken=NpmToken.{YOUR_NPM_Token}
  ```

#### Documentation

- :information_source: read [CONTRIBUTING.md](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/blob/develop/CONTRIBUTING.md)

- :information_source: read [.gitlab-ci.yml](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/blob/develop/.gitlab-ci.yml)

## Openshift deployment

[![openshift](https://img.shields.io/badge/openshift-deployed-red)](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/commits/develop)

:warning: We need to be admin of the namespace. Ask to **Advance team** :family: for more informations

### Description

This whiteApp is _cloud ready_ and is [deployed](https://nestjs-whiteapp-dev-bsc-api-a2847.hmlogp.dns21.socgen/swagger/).
In order to deploy your application, you need to use 3 tools. This section will help you to have a global overweiw of needed actions.

This section is **In progress**.

#### Information sources

- :information_source: read [DEX Openshift](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/openshift-docs/README.md) documentation

### Tools

This section present _cloud deployment process_. The main goal is to understand the use of the three main tools : [B-sofaast](https://login.safe.socgen/auth/?level=10&sourceURL=https%3A%2F%2Fapps.safe.socgen%2Fb-sofaast&APPLICATION=dpt#/apps/openshift), [Jenkins](https://sofa.socgen/cloudbees/login) and [Openshift](https://hogpmaster.dns21.socgen:8443/).

#### 1 - B-sofaast

B-sofaast is an application developped by SOFA team. This tool allow you to build and deploy project infrastructure.

##### 1.1 - Configure infrastrucutre

- :information_source: You need to configure your project as [folowing](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/openshift-docs/nestjs-deploy.md#b-sofaast)

##### 1.2 - Build infrastrucutre

- :information_source: You need to read the folowing [documentation](https://docs-ui-prod-bsc-dpt-a2742-services.pogp.dns20.socgen/openshift/infrastructure/b-sofaast/)

- 'Simply' get a token from our openshift session, and put the token on appropiate slug. Run build. It's all the folks.

#### 2 - Jenkins

##### 2.1 - Jenkins & B-sofaast

Using B-sofaast tool configure automaticaly a Jenkins pipeline.
You can configure and customise our pipeline as described in [DEX documentaion](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/openshift-docs/nestjs-deploy.md#jenkins).
Ask **Advance team** for more information.

- :information_source: [Build jenkins](https://docs-ui-prod-bsc-dpt-a2742-services.pogp.dns20.socgen/openshift/deploy/non-production/#launch-the-pipeline-in-jenkins)

#### 3 - Openshift

##### 3.1 - Openshift & B-sofaast

Using B-sofaast tool configure automaticaly [Openshift pod](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/openshift-docs/nestjs-deploy.md#openshift).

:information_source: Please read the [following section](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/openshift-docs/nestjs-deploy.md#b-sofaast)

#### 4 - Deployment process

- :information_source: You need to read the folowing [documentation](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome/blob/master/doc/openshift-docs/README.md)

## Business exceptions

### Description

To handel Business and HTTP exceptions, we use validation pipe, we create an abstract class and we use AllExceptions filter.

### HTTP exceptions

- To handel HTTP errors, we check if the exception is instance of HTTP and we returned **exception code**, **exception message** and **errors array**
- :information_source: @see [Base Exceptions](https://docs.nestjs.com/exception-filters#base-exceptions)

```bash

```

### Business exceptions

If you want to create a new business exception, you need to create a new class and extend `BusinessException`.  
BusinessException class have 5 properties, 2 are optionals :

- status : http status code
- code : error code, 404 for example
- message : custom error message
- description : optional, custom description
- errors : optional, array of errors details

If you want create a new **Business Exception**, you can extend Business class as following example

#### Example

```bash
// EntityNotFoundException can extend BusinessException
export class EntityNotFoundException extends BusinessException {
  constructor(code: string, message: string, description?: string, error?) {
    super(404, code, message, description, error);
  }
}
```

## Troubleshooting

### Description

This section is **In progress**

### Documentation

- :information_source: How to [contribute](https://apps.bsc.aws.societegenerale.com/gitlab/dex/backend/nestjs-api-whiteapp/blob/master/CONTRIBUTING.md) ?

- :information_source: [DEX welcome](https://apps.bsc.aws.societegenerale.com/gitlab/dex/welcome) documentation

## VS Code plugins

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Integrates ESLint into VS Code.

[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): VS Code plugin for Prettier.

[Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)

[Commitzen](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen)

[Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock)
