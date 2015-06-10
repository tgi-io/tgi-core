# tgi-core [![Build Status](https://travis-ci.org/tgi-io/tgi-core.svg?branch=master)](https://travis-ci.org/tgi-io/tgi-core) [![Coverage Status](https://img.shields.io/coveralls/tgi-io/tgi-core.svg)](https://coveralls.io/r/tgi-io/tgi-core)

Core Objects [read the spec](spec/README.md).

# To Do

Current
-------
- Command function should call complete event inherently if function did not call or abort


Presentation Management
---
- ActiveView
    - presentation
    - mode
    - key [ undefined <single view> , null , value ]
- presentation = Presentation.activate ( key , mode )
- close ( key )


Later
-----
- REPLInterface - handle presentation (WIP)
    - view shows and leaves
    - edit edits
    - if commands present then waits for commands ?
    - **OR** execute waits ?
- app.dispatch(request,response) ... response is not used review design
- Presentation use model property & modelConstructor method or get rid of
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
