/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/core/tgi-core.js
 **/
var CORE = function () {
  return {
    version: '0.0.7',
    Application: Application,
    Attribute: Attribute,
    Command: Command,
    Delta: Delta,
    Interface: Interface,
    List: List,
    Log: Log,
    Message: Message,
    Model: Model,
    Presentation: Presentation,
    Procedure: Procedure,
    Request: Request,
    Session: Session,
    Store: Store,
    Transport: Transport,
    User: User,
    Workspace: Workspace,
    injectMethods: function (that) {
      that.Application = Application;
      that.Attribute = Attribute;
      that.Command = Command;
      that.Delta = Delta;
      that.Interface = Interface;
      that.List = List;
      that.Log = Log;
      that.Message = Message;
      that.Model = Model;
      that.Presentation = Presentation;
      that.Procedure = Procedure;
      that.Request = Request;
      that.Store = Store;
      that.Session = Session;
      that.Transport = Transport;
      that.User = User;
      that.Workspace = Workspace;
    }
  };
};
