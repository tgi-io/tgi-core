# tgi-core [![Build Status](https://travis-ci.org/tgi-io/tgi-core.svg?branch=master)](https://travis-ci.org/tgi-io/tgi-core) [![Coverage Status](https://img.shields.io/coveralls/tgi-io/tgi-core.svg)](https://coveralls.io/r/tgi-io/tgi-core)

Core Objects [read the spec](spec/README.md).

# To Do

Current
-------

Presentation Management
---
- ActiveView
    - presentation
    - mode
    - key [ undefined <single view> , null , value ]
- presentation = Presentation.activate ( key , mode )
- close ( key )

View
---
+ Add reference from Attribute when models created
- View created with:
    - new View(primaryModel, relatedModels, relatedIDs, attributeArray);
    - Primary model
    - Related models {'Customer': customerModel, 'Etc': etcModel} ... values are actual models 
    - Related IDs {'Customer': customerID, 'Etc': etcID} // values are attributes in Primary model
    - Array of attributes (must have model ref / can't be standalone attribute)
- Add to getlist as parm instead of Model    

Later
-----
- coerce() useless since have to have attribute instances limits - make util func ?
- Transport sendRaw & onRaw have no tests
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
- model tests don't use SurrogateModel as much as it should

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
