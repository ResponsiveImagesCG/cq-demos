# Container Query demos

*As yet unproposed*, the Container Queries CSS Module allows developers to style elements based on their size and shape. This repo is intended to allow developers to experiment with “container queries” and, in doing so, help find potential issues that might arise when writing the proposed specification.

This repo uses a modified version of [Rob Brackett’s](https://github.com/Mr0grog) [element-query](https://github.com/Mr0grog/element-query) script.

## Adding a Demo

1. Copy the `demo-template` directory to `/demos`
2. Rename the directory to whatever you’d like to name your demo, or just a numbered `demoX`.
3. Follow the “Quick Setup” instructions below.
4. Build a demo using any combination of `.el:media(min-width){}` and/or `.el:media(max-width){}` syntax. This can be as simple or as complex as you like; anything from changing a background color on an element to an entire page layout.
5. Update the “Existing Demos” section of the `README` below with a link to your demo and a brief description.
6. Send us a PR, and we’ll add your demo to the collection here.
7. File an issue if you have any feedback at all—whether you ran into any problems using this pattern, have any suggestions for the syntax itself, or just want to share your thoughts on using it.

## Existing Demos

**[Whitworth](http://responsiveimagescg.github.io/ALA-Whitworth-Demo/demo1/index.html)**<br>
Illustrates how container queries could be used for both modular layout, and finessing smaller responsive design details (in this case, the position of the “add to cart” button).

## Quick Setup

These demos can only be viewed via HTTP—you can’t open the index files in your browser, if you’ve cloned the repo and want to tinker with these pages locally. You have two options for running this locally without wading through a bunch of Apache nonsense:

### PHP Server
OSX ships with PHP, which makes it _very_ easy to spin up a quick server. Naviate to the repo’s root directory in your terminal and enter the following:

```shell
$ php -S localhost:7777
```

You should see something like:

```shell
Listening on http://localhost:7777
Document root is /Users/wilto/Sites/ricg/eq-demos
Press Ctrl-C to quit.
```

Then open http://localhost:7777/demos/(demo-name) in your browser

### NodeJS

If you don’t have it installed already, you’ll need to install Node from https://nodejs.org/ (or `brew install node`, if you use Homebrew).

Once you have Node installed, navigate to the repo’s root directory in your terminal and enter the following:

```shell
$ npm install
```

This will install the node server’s dependencies. Once complete, enter:

```shell
$ node server.js
```

You should see something like:

```shell
Listening on http://localhost:7777
Document root is /Users/wilto/Sites/ricg/eq-demos
Press Ctrl-C to quit.
```

Then open http://localhost:7777/demos/(demo-name) in your browser

## Demo Syntax

Only `.element:media( min-width ) {} ` and `.element:media( max-width ) {} ` are available so far.

The container query pseudo-polyfill used here is a modified version of <a href="https://github.com/Mr0grog/element-query">element-query</a>.

## Motivation

Container Queries are the natural and much-needed evolution of Media Queries.

Where Media Queries are concerned with the _viewport_ size, Container Queries are concerned with the styling child elements based on the size of a parent element. As a result, Container Queries allow content to adapt to a wide range of viewing experiences without having to change the content itself.

They also simplify stylesheets by removing the need to specify layout conditions between the screen and the element being styled.

## Use cases

The simpliest use case is: “I have a widget that needs to look good in any column of our layout, whether that column is small, medium, or large.”

Use cases are more fully documented in the [Use Cases and Requirements for Container Queries Editor’s Draft](http://responsiveimagescg.github.io/cq-usecases/).
