var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observable = require("data/observable");

var PlaylistItemModel = (function (_super) {

    __extends(PlaylistItemModel, _super);

    //constructor
    function PlaylistItemModel(source) {
        _super.call(this);

        //save javascript object to _source
        this._source = source;
        var property;
        for (property in this._source) {
            this.set(property, this._source[property]); //generate observable property for each js object prop
        }
    }
    
    return PlaylistItemModel;
})(observable.Observable);
exports.PlaylistItemModel = PlaylistItemModel;