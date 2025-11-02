# React Simple SSR Demo

How to do React Server-Side Rendering (SSR) without meta frameworks or any build tools? This is how!

High level idea:

- importmap and node modules works on aliased names like `import .. from 'react'`. If you map the word `react` to `esm.sh` on client via importmap [1] and same as node module for server [2] then your react components can work both on server and client without code change / bundler
- From server, use react renderToString() function for HTML generation [3] and also pass server data as JSON in the HTML
- On client, hydrate DOM without throwing away the existing DOM

No-build alternatives to JSX and Typescript
- `htm` is alternative to JSX that works without a build tool
- Typescript within JSDoc gives same typescript features without compilation step

This setup is good for educational purpose and also for small websites.

`livereload` npm module and it's client script reloads the browser on dev env

## How to run the thing?

```bash
npm install
npm run dev
```

Open your browser at http://localhost:4000

VSCode note: Install [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) extension to syntax highlight HTM strings.

## Limitations of this setup

1. **Managing large import maps**: This isn't fun, especially when debugging missing imports, as you are fixing stuff serially. i.e. you fix one import, and then realize there are more imports to fix and the loop repeats like this till you get the app working. Sub-sub dependencies of dependencies can have conflicting versions of a library, and the config to fix this feels like writing a package-lock.json by hand. For managing large import maps you need tools like jspm, which helps but it too is buggy the last time I tried.

2. **Network waterfalls**: More chances of waterfall requests when importing JS, especially if you have lots of nested imports.  HTTP/2 can only mitigate the effects of this a bit. Preload link tags can fix this, but without a build tool you end up managing the tags manually. But again, if you don't have many JS files, then it's manageable.

3. **Caching**: In the current state of code, you shouldn't cache anything from the static directory in the browser. This is because when you release your app with any change to any JS/CSS/image file, the browser cache will be old and they will continue using old JS/CSS/images. One way to improve this template is by adding code to compute the hash of the static directory on app startup, and adding that as prefix to the static URL path `/static/<hash>`. This avoid a build tool, but it's an "all or nothing" caching busting strategy, in that even a single character change in the static directory will bust the entire cache. Works, and maybe good enough for small sites.

4. **HTM Typescript support**: Component props within htm tagged template literals cannot be type checked (it is probably theoretically possible as typescript-lit-html-plugin exists, but as of now no one seem to have tried implementing it).

### Notes

[1] On a production environment, you may want to dependencies into the repo, as you don't want to be dependent on esm.sh's uptime.

[2] Make sure that importmap dependencies matches npm dependency version.

[3] renderToString has some limitations (read the react docs). However it is quite portable. You can use it even in aws lambda

Why use react when it's 60 kb (gzipped) in size? Good question. For small websites, you can replace this same template with 4 kb preact.
