const { HARVESTING, TRANSPORTING } = require("userConstants");

const harvesterParts = [MOVE, WORK, CARRY];

const roleHarvester = {
  /** @param {Creep} creep */
  /** @param {Spawn} spawn */
  spawn: function (spawn) {
    return [
      harvesterParts,
      `harvester${Date.now() % 100000}`,
      {
        memory: {
          role: "harvester",
          doing: TRANSPORTING,
          originSpawn: spawn.id,
          target: spawn.id,
        },
      },
    ];
  },

  /** @param {Creep} creep */
  run: function (creep) {
    let target = Game.getObjectById(creep.memory.target);
    switch (creep.memory.doing) {
      case HARVESTING:
        if (creep.store.getFreeCapacity()) {
          if (creep.harvest(target) === ERR_NOT_IN_RANGE) creep.moveTo(target);
        } else {
          creep.memory.target = creep.memory.originSpawn;
          creep.memory.doing = TRANSPORTING;
        }
        break;
      case TRANSPORTING:
        if (creep.store.getUsedCapacity()) {
          if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            creep.moveTo(target);
        } else {
          creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES).id;
          creep.memory.doing = HARVESTING;
        }
        break;
    }
  },
};

module.exports = roleHarvester;
