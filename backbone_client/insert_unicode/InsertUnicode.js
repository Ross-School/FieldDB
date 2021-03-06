define([
  "libs/FieldDBBackboneModel"
], function(
  FieldDBBackboneModel
) {
  var InsertUnicode = FieldDBBackboneModel.extend(
    /** @lends InsertUnicode.prototype */
    {
      /**
       * @class InsertUnicode allows a user to use IPA symbols, characters other than Roman alphabets, etc..
       * 		Users can add new symbols. Added symbols are saved and stored, and will show up next time the user
       * 		opens InsertUnicode box.
       *
       * @description Initialize function
       *
       * @extends Backbone.Model
       *
       * @constructs
       */
      initialize: function() {},

      defaults: {
        symbol: "",
        tipa: "",
        useCount: 0
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

  return InsertUnicode;

});
