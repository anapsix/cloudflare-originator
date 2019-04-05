# CloudFlare Originator
Cloudflare Origin Customizer, allowing to map Cloudflare CDN to Origin paths

<a href="https://www.cloudflare.com/apps/cloudflare-originator/install?source=button">
  <img
    src="https://install.cloudflareapps.com/install-button.png"
    alt="Install Cloudflare Originator with Cloudflare"
    border="0"
    width="150">
</a>

## Overview

This Cloudflare App attempts to replicate AWS CloudFront's convenient capability of mapping path of incoming requests to a different origin path.

## Features

#### Cloudflare DNS

Adds DNS record used as your Cloudflare-backed CDN.

#### Cloudflare Workers

Adds [Cloudflare Worker](https://developers.cloudflare.com/workers/), which maps all incoming requests matching your Cloudflare CDN hostname to configured Origin path.

> WARNING: When using S3 as Origin, make sure to have S3 URLs publicly reachable, or have appropriate bucket policy. See [S3_as_Origin.md](./S3_as_Origin.md) for example policy.

## Setup

- Fork and clone the repo.
- Make desired changes.
- Install the dependencies with `yarn install` then build the project with `yarn build` (or `npm run build`).
- Next, navigate to [Cloudflare App Creator](https://www.cloudflare.com/apps/developer/app-creator) and upload your project directory.

The App Creator will update automatically on file changes (Chrome only). Once you're done testing, press Create App to submit your app for moderation. Refer to our [Terms of Use](https://www.cloudflare.com/apps/developer/docs/resources/terms-of-use) for more information.

## Usage

- `yarn start` (or `npm start`) Sets up your dev environment and runs Webpack in watch mode.
- `yarn build` (or `npm run build`) Lints your project and compiles your JavaScript and CSS once for release.

### Other Interesting Scripts

- `dev:setup` Add other initialization scripts to your development pipeline here.

The project uses [yarn-run-all](https://www.npmjs.com/package/yarn-run-all) which makes it easy to run tasks in series or parallel using `yarn` or `npm`.

## Details

#### `install.json`

This is where all the [installer options](https://www.cloudflare.com/apps/developer/docs/install-json) are added for the app.

DNS field is used to to configure [Cloudflare DNS Records](https://api.cloudflare.com/#dns-records-for-a-zone-properties). If you don't want to configure DNS, just delete this field.

#### `src/index.js`

This is where the magic happens. Your app starts here.

#### `src/styles.css`

Write your app styles here.

#### `workers/worker.js`

This file is used to add a [Cloudflare Worker](https://developers.cloudflare.com/workers/) to the app. Each app may contain one worker. If you don't want to use workers, just delete this file along with the workers configuration in `install.json`.

#### `media/**`

Contains icons, tile images, and screenshots used in your Cloudflare Apps page.

[Download <code class="inline">media-templates.sketch</code>](https://github.com/CloudflareApps/MediaTemplates/raw/master/media-templates.sketch)

#### `webpack.config.js`

Simple Webpack 4 config using Babel and CSS Loader. Please refrain from modifying the config to minify your built code.

### Troubleshooting

The Cloudflare [developer documentation](https://www.cloudflare.com/apps/developer/docs/getting-started) for examples and API usage.


## Authors

- Anastas Dancha (aka [@anapsix](https://github.com/anapsix)) - original implementation
- Nicole Corbin (aka [@ncorbin](https://github.com/ncorbin)) - logo artwork

