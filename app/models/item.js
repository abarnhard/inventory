'use strict';

var cItem = global.mongodb.collection('items');

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

module.exports = Item;
