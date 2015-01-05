# tgi-core [![Build Status](https://travis-ci.org/tgi-io/tgi-core.svg?branch=master)](https://travis-ci.org/tgi-io/tgi-core)

Core Objects [read the spec](spec/README.md).

Todo
----
- merge core and utility

App To Do
---
- remove setpresentation req. for app
- have app.start pass presentation / command / function etc if anything applies
- propagate user queries to interface
- incorporate user queries in integration test
- var app.code or app.script = function(function(){}){} ... or nix this and use app.start function

Interface To Do
---
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

obselete design
---
- refactor CORE and UTILITY to TGI.CORE and TGI.UTILITY TGI.STORE TGI.INTERFACE
- Refactor inject global and closure option - will need script <no global>
- coverage sux bad one day I'll...
- workspace beef up to load in app/interface and work ...

