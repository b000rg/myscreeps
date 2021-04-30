const { HARVESTING, UPGRADING } = require("userConstants");
const { storeIsEmpty, storeIsFull } = require("helperFunctions");

const upgraderParts = [WORK, CARRY, MOVE];

const roleUpgrader = {
  spawn: function () {
    return [
      upgraderParts,
      `upgrader${Date.now() % 100000}`,
      {
        memory: {
          role: "upgrader",
          doing: UPGRADING,
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
          creep.memory.doing = UPGRADING;
          creep.memory.target = creep.room.controller.id;
        } else {
          if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
        break;
      case UPGRADING:
        if (storeIsEmpty(creep.store)) {
          creep.memory.doing = HARVESTING;
          creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES).id;
        } else {
          if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
        break;
    }
  },
};

module.exports = roleUpgrader;
