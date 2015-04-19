var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observable = require("data/observable");

var SongsItemViewModel = (function (_super) {

    __extends(SongsItemViewModel, _super);

    //constructor
    function SongsItemViewModel(source) {
        _super.call(this);

        //save javascript object to _source
        this._source = source;
        var property;
        for (property in this._source) {
            this.set(property, this._source[property]); //generate observable property for each js object prop
        }
    }
    
    return SongsItemViewModel;
})(observable.Observable);
exports.SongsItemViewModel = SongsItemViewModel;