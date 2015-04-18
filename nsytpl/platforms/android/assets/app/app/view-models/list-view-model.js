var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observableArrayModule = require("data/observable-array");
var playlistItemModule = require('./playlist-item-model');

var ListViewModel = (function (_super) {
    __extends(ListViewModel, _super);
    function ListViewModel() {
        _super.call(this);
        this._listViewItems = new observableArrayModule.ObservableArray();
    }

	ListViewModel.prototype.addItem = function (item) {
            var newPlaylistItem = new playlistItemModule.PlaylistItemModel(item);
            this._listViewItems.push(newPlaylistItem);
	};

    Object.defineProperty(ListViewModel.prototype, "playlists", {
        get: function () {
        	return this._listViewItems;
        },
        enumerable: true,
        configurable: true
    });

    return ListViewModel;
})(observableArrayModule.ObservableArray);
exports.ListViewModel = ListViewModel;
exports.listViewModel = new ListViewModel();
