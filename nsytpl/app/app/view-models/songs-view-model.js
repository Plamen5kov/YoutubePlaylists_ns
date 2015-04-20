var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observableArrayModule = require("data/observable-array");
var songsItemViewModel = require('./songs-item-view-model');

var SongsViewModel = (function (_super) {

    __extends(SongsViewModel, _super);
    function SongsViewModel() {
        _super.call(this);
        this._listViewItems = new observableArrayModule.ObservableArray();
    }

	SongsViewModel.prototype.addItem = function (item) {
        var newPlaylistItem = new songsItemViewModel.SongsItemViewModel(item);
        this._listViewItems.push(newPlaylistItem);
	};

    SongsViewModel.prototype.moveItem = function (index, direction) {
        var itemToSwapWithIndex;

        if(direction == 'up') {
            itemToSwapWithIndex = index - 1;

            if(itemToSwapWithIndex == -1) {
                itemToSwapWithIndex = this._listViewItems.length - 1;
            }    
        }
        else if (direction == 'down') {
            itemToSwapWithIndex = index + 1;

            if(itemToSwapWithIndex == this._listViewItems.length) {
                itemToSwapWithIndex = 0;
            }    
        }

        this.swapItemsWithIndecies(index, itemToSwapWithIndex);
    };   

    SongsViewModel.prototype.swapItemsWithIndecies = function (firstIndex, secondIndex) {

        var itemToSwap = this._listViewItems.getItem(firstIndex);
        var upperItem = this._listViewItems.getItem(secondIndex);

        //swap indecies
        upperItem.set('id', firstIndex);
        itemToSwap.id = secondIndex;

        //swap items
        this._listViewItems.setItem(secondIndex, itemToSwap);
        this._listViewItems.setItem(firstIndex, upperItem);

        itemToSwap = undefined;
    } 

    SongsViewModel.prototype.getItem = function(index){
        return this._listViewItems.getItem(index);
    }

    Object.defineProperty(SongsViewModel.prototype, 'length', {
        get: function () {
            return this._listViewItems.length;
        }
    })

    Object.defineProperty(SongsViewModel.prototype, 'songs', {
        get: function () {
        	return this._listViewItems;
        },
        enumerable: true,
        configurable: true
    });

    return SongsViewModel;
})(observableArrayModule.ObservableArray);
exports.SongsViewModel = SongsViewModel;
exports.songsViewModel = new SongsViewModel();