const { HARVESTING, REPAIRING } = require("userConstants");
const { storeIsFull, storeIsEmpty } = require("helperFunctions");

const maintainerParts = [MOVE, MOVE, CARRY, WORK];

const findDecayedStructure = (creep) =>
  creep.room
    .find(FIND_MY_STRUCTURES)
    .filter((struct) => struct.hits < struct.hitsMax)[0];

const roleMaintainer = {
  spawn: function () {
    return [
      maintainerParts,
      `maintainer${Date.now() % 100000}`,
      {
        memory: {
          role: "maintainer",
          doing: REPAIRING,
          target: null,
        },
      },
    ];
  },

  run: function (creep) {
    let target = creep.memory.target;
    switch (creep.memory.doing) {
      case HARVESTING:
        if (storeIsFull(creep.store)) {
          creep.memory.target = findDecayedStructure(creep).id;
          if (creep.memory.target) creep.memory.doing = REPAIRING;
        } else {
          if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
        break;
      case REPAIRING:
        if (storeIsEmpty(creep.store)) {
          creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES).id;
          if (creep.memory.target) creep.memory.doing = HARVESTING;
        } else {
          if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
    }
  },
};

module.exports = roleMaintainer;
