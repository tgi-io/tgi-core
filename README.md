# tgi-core [![Build Status](https://travis-ci.org/tgi-io/tgi-core.svg?branch=master)](https://travis-ci.org/tgi-io/tgi-core) [![Coverage Status](https://img.shields.io/coveralls/tgi-io/tgi-core.svg)](https://coveralls.io/r/tgi-io/tgi-core)

Core Objects [read the spec](spec/README.md).

App To Do
---
- have app.start pass presentation / command / function etc if anything applies
- propagate user queries to interface
- incorporate user queries in integration test
- var app.code or app.script = function(function(){}){} ... or nix this and use app.start function

Interface To Do
---
- work up REPLInterface
- sysNav (required) and appNav (optional)
- cli factor for commands app commands / prefix for system

Presentation standard tabs
---
- appNav ... main menu for app
- Info ... about app and interface - store connection(s)
- Find ... item in store
- Bookmarks ... favorite items in store
- History ... logged activity in store
- Workspace ...
- Alerts ...

Misc
---
- fix index ⌘ in helps
- improve coverage


