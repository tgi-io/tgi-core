# tgi-core [![Build Status](https://travis-ci.org/tgi-io/tgi-core.svg?branch=master)](https://travis-ci.org/tgi-io/tgi-core) [![Coverage Status](https://img.shields.io/coveralls/tgi-io/tgi-core.svg)](https://coveralls.io/r/tgi-io/tgi-core)

Core Objects [read the spec](spec/README.md).

To Do
---
- REPLInterface - handle nav and presentation
- Misc: fix index ⌘ in helps
- Misc remove bucket - replace example with closure variables as needed
- Review models for completeness esp. Workspace and Session
- Interface.notify needs review
- Misc: improve coverage
- Review tequila for lingering todo
- extend spec to external stores & interfaces
- have ask() let Attribute be optional so can do quicker ask functions
- make Command.prototype.restart work to restart a command
- command event for error needs to pass error along

Standard Commands
---
- AppCommand ... Top level commands for app
- InfoCommand ... about app and interface - store connection(s) - also sys info
- FindCommand ... model
- FavoritesCommand ... favorite models
- HistoryCommand ... logged activity
- WorkspaceCommand ... active models
- AlertsCommand ... shit you need to deal with
