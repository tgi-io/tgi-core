/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/tgi-core.source.js
 **/
var TGI = {
  CORE: function () {
    return {
      version: '0.4.48',
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
      Text: Text,
      Transport: Transport,
      User: User,
      View: View,
      Workspace: Workspace,
      inheritPrototype: inheritPrototype,
      getInvalidProperties: getInvalidProperties,
      getConstructorFromModelType: getConstructorFromModelType,
      createModelFromModelType: createModelFromModelType,
      getObjectFromCPON: getObjectFromCPON,
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
