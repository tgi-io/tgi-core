# tgi-core [![Build Status](https://travis-ci.org/tgi-io/tgi-core.svg?branch=master)](https://travis-ci.org/tgi-io/tgi-core) [![Coverage Status](https://img.shields.io/coveralls/tgi-io/tgi-core.svg)](https://coveralls.io/r/tgi-io/tgi-core)

Core Objects [read the spec](spec/README.md).

# To Do

Current
-------
- wtf fix infterface / app's primary presentaion to primary commands sans presentation pardign ....... design [sic]
- make Command.prototype.restart work to restart a command
- command event for error needs to pass error along
- REPLInterface - search for  // todo fixshit need to make yesno return undefined pass tests also choice return index or value ???
- REPLInterface - handle presentation

Later
-----
- Review models for completeness esp. Workspace and Session
- Interface.notify needs review
- Misc: improve coverage
- Misc remove bucket - replace example with closure variables as needed
- Review tequila for lingering todo

# Design WIP

Standard Commands
---
- MenuCommand ... Menu of commands for app
- InfoCommand ... about app and interface - store connection(s) - also sys info
- FindCommand ... model
- FavoritesCommand ... favorite models
- HistoryCommand ... logged activity
- WorkspaceCommand ... active models
- AlertsCommand ... shit you need to deal with

Presentation
-------
- use model property & modelConstructor method or get rid of
- add type property: Nav, List, View, Edit
