define([
  "libs/FieldDBBackboneModel"
], function(
  FieldDBBackboneModel
) {
  var HotKey = FieldDBBackboneModel.extend( /** @lends HotKey.prototype */ {
    /**
     * @class A HotKey is a keyboard shortcut that uses one key (or a
     *        combination thereof) which allows users to execute a command
     *        without using a mouse, a menu, etc.
     *
     * @description The initialize function probably checks to see if any
     *              hotkeys exist and creates a new one if there are none.
     *
     * @extends Backbone.Model
     * @constructs
     */

    // This is the constructor. It is called whenever you make a new
    // HotKey.
    initialize: function() {
      // this.bind('error', function(model, error) {
      // // TODO Handle validation errors
      // });

    },

    defaults: {
      firstKey: "",
      secondKey: "",
      functiontocall: function() {},
      description: ""
    },

    // Internal models: used by the parse function
    internalModels: {
      // There are no nested models
    },
    saveAndInterConnectInApp: function(callback) {

      if (typeof callback == "function") {
        callback();
      }
    }
  });

  return HotKey;
});
