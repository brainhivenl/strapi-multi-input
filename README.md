# Strapi plugin multi-input (work in progress)

A strapi custom field for tags and other multi-input fields.

## Fork

This repository is heavily based on: [strapi-multi-select](https://github.com/Zaydme/strapi-plugin-multi-select).

## Installation

To install this plugin, you need to add an NPM dependency to your Strapi application:

```
# Using Yarn
yarn add strapi-plugin-multi-input

# Or using NPM
npm install strapi-plugin-multi-input
```

Then, you'll need to build your admin panel:

```
# Using Yarn
yarn build

# Or using NPM
npm run build
```

## Usage

After installation you will find the multi-input at the custom fields section of the content-type builder.

You add options to the multi-input by adding a line separated list of options to the options field.

in this case the API will return

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "stuff": ["Banana", "citron"]
    }
  }
}
```
