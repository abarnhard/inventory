'use strict';

var cItem = global.mongodb.collection('items');
var _ = require('lodash');

function Item(name, room, acquired, count, cost){
  this.name = name;
  this.room = room;
  this.acquired = new Date(acquired);
  this.count = parseInt(count);
  this.cost = parseFloat(cost);

}

Item.prototype.save = function(cb){
  cItem.save(this, function(err, object){
    cb();
  });
};

Item.prototype.value = function(){
  return this.count * this.cost;
};

Item.find = function(query, cb){
  cItem.find(query).toArray(function(err, items){
    cb(items);
  });
};

Item.value = function(query, cb){
  Item.find(query, function(items){
    var sum = 0, item;
    for(var i = 0; i < items.length; i++){
      item = _.create(Item.prototype, items[i]);
      sum += item.value();
    }
    cb(sum);
  });
};

module.exports = Item;
