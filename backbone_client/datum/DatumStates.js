define([
  "backbone",
  "datum/DatumState"
], function(
  Backbone,
  DatumState
) {
  var DatumStates = Backbone.Collection.extend( /** @lends DatumStates.prototype */ {
    /**
     * @class Collection of Datum State
     *
     * @description The initialize function
     *
     * @extends Backbone.Collection
     * @constructs
     */
    initialize: function() {},
    internalModels: DatumState,

    model: DatumState,

    addIfNew: function(datumStateObject) {
      var newState = datumStateObject.state;
      if (!newState) {
        return;
      }
      var existing = this.where({
        state: newState
      });
      if (existing.length > 0) {
        return;
      }
      this.add(new DatumState(datumStateObject));

    },
    /**
     * Gets a copy DatumStates containing new (not references) DatumStates objects
     * containing the same attributes.
     *
     * @return The cloned DatumFields.
     */
    clone: function() {
      var newCollection = new DatumStates();

      for (var i = 0; i < this.length; i++) {
        newCollection.push(new DatumState(this.models[i].toJSON()));
      }

      return newCollection;
    }
  });

  return DatumStates;
});
