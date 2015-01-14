# tgi-core [![Build Status](https://travis-ci.org/tgi-io/tgi-core.svg?branch=master)](https://travis-ci.org/tgi-io/tgi-core) [![Coverage Status](https://img.shields.io/coveralls/tgi-io/tgi-core.svg)](https://coveralls.io/r/tgi-io/tgi-core)

Core Objects [read the spec](spec/README.md).

To Do
---
- App: incorporate user queries in integration test

- App: have app.start pass presentation / command / function etc if anything applies
- App: var app.code or app.script = function(function(){}){} ... or nix this and use app.start function
- Interface: work up REPLInterface
- Misc: fix index ⌘ in helps

- Review models for completeness esp. Workspace and Session

- Misc: improve coverage

Presentation standard tabs
---
- AppNav ... main menu for app
- Info ... about app and interface - store connection(s)
- Find ... item in store
- Favorites ... favorite items in store
- Bookmarks ... favorite items in store
- History ... logged activity in store
- Workspace ... 
- Alerts ...
