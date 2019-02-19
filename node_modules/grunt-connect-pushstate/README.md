# grunt-connect-pushstate

> A grunt plugin that provides connect middleware to rewrite select requests to the site root (or a custom defined root), thus allowing for pushstate routing.
>
> Requests including a file extension are left untouched so site assets like your images, stylesheets, and JavaScripts will load unaffected, while requests without a file extension, presumably pages or actions within your site, are rewritten to point at the root, with the original URL intact, thus allowing your pushstate router to handle the request.
> 
> This plugin is designed for use with the [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) plugin.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-connect-pushstate --save
```

### Overview

Load the middleware by adding the following line of JavaScript to the top of your project's Gruntfile.

```js
var pushState = require('grunt-connect-pushstate/lib/utils').pushState;
```

Adjust the "connect" task by adding the pushState() middleware call to the connect options middleware hook, amongst your other middleware. You can customize the root path by passing it in as a parameter.  eg) `pushState('/somewhere/')`  Note that connect.static is needed as well.

```js
connect: {
  options: {
    hostname: 'localhost',
    port: 3000,
    base: 'www/',
    middleware: function (connect, options) {
      return [
        // Rewrite requests to root so they may be handled by router
        pushState(),

        // Serve static files
        connect.static(options.base)
      ];
    }
  }
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

*Suggestions for improvement and/or added flexibility are very welcome. :)*

## Release History
- 0.1.0 Initial release
- 0.1.1 Update readme example to show connect.static middleware usage
- 0.1.2 Add empty tasks directory to avoid warnings if included via matchdep
- 0.2.0 Allow for custom root definition.  Rewrite tests using mocha.
  Note that you now need to explicitly call the pushState function. eg) pushState() rather than pushState
