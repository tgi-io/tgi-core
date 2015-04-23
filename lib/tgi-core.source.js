/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.source.js
 **/
var TGI = {
  CORE: function () {
    return {
      version: '0.3.5',
      Application: Application,
      Attribute: Attribute,
      Command: Command,
      Delta: Delta,
      Interface: Interface,
      List: List,
      Log: Log,
      MemoryStore: MemoryStore,
      Message: Message,
      Model: Model,
      Presentation: Presentation,
      Procedure: Procedure,
      REPLInterface: REPLInterface,
      Request: Request,
      Session: Session,
      Store: Store,
      Transport: Transport,
      User: User,
      Workspace: Workspace,
      inheritPrototype: inheritPrototype,
      getInvalidProperties: getInvalidProperties,
      trim: trim,
      ltrim: ltrim,
      rtrim: rtrim,
      left: left,
      center: center,
      right: right,
      lpad: lpad,
      rpad: rpad,
      cpad: cpad,
      contains: contains
    };
  }
};
