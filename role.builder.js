const { HARVESTING, BUILDING } = require("userConstants");
const { storeIsFull, storeIsEmpty } = require("helperFunctions");

const builderParts = [WORK, CARRY, MOVE, MOVE];

const roleBuilder = {
  spawn: function () {
    return [
      builderParts,
      `builder${Date.now() % 100000}`,
      {
        memory: {
          role: "builder",
          doing: BUILDING,
          target: null,
        },
      },
    ];
  },

  run: function (creep) {
    let target = Game.getObjectById(creep.memory.target);
    switch (creep.memory.doing) {
      case HARVESTING:
        if (storeIsFull(creep.store)) {
          let newTarget = creep.room.find(FIND_MY_CONSTRUCTION_SITES)[0];
          if (newTarget) {
            creep.memory.doing = BUILDING;
            creep.memory.target = newTarget.id;
          }
        } else {
          if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
        break;
      case BUILDING:
        if (storeIsEmpty(creep.store)) {
          let newTarget = creep.pos.findClosestByPath(FIND_SOURCES);
          if (newTarget) {
            creep.memory.doing = HARVESTING;
            creep.memory.target = newTarget.id;
          }
        } else {
          Game.map.visual.text("🔨", target.pos);
          if (creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
        break;
    }
  },
};

module.exports = roleBuilder;
