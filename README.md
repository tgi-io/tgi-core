# tgi-core [![Build Status](https://travis-ci.org/tgi-io/tgi-core.svg?branch=master)](https://travis-ci.org/tgi-io/tgi-core) [![Coverage Status](https://img.shields.io/coveralls/tgi-io/tgi-core.svg)](https://coveralls.io/r/tgi-io/tgi-core)

Core Objects [read the spec](spec/README.md).

To Do
---
- REPLInterface - handle nav and presentation
- Misc: fix index ⌘ in helps
- Misc remove bucket - replace example with closure variables as needed
- Review models for completeness esp. Workspace and Session
- Misc: improve coverage
- Review tequila for lingering todo
- extend spec to external stores & interfaces
- fix // repl.notify(new Message('Nice to meet you ' + answer + '.'));
- why is interface.notify needing message parm and not just text

Presentation standard procedures
---
- AppNav ... main menu for app
- About ... about app and interface - store connection(s) - also sys info
- Find ... item in store
- Favorites ... favorite items in store
- Bookmarks ... favorite items in store
- History ... logged activity in store
- Workspace ... active models
- Alerts ...
