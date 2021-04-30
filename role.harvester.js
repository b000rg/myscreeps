const { HARVESTING, DELIVERING } = require("userConstants");

const harvesterParts = [MOVE, WORK, CARRY];

const roleHarvester = {
  /**
   * Generate spawn arguments for creep
   * @param {Spawn} spawn - StructureSpawn that will be spawning creep */
  spawn: function (spawn) {
    return [
      harvesterParts,
      `harvester${Date.now() % 100000}`,
      {
        memory: {
          role: "harvester",
          doing: DELIVERING,
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
          creep.memory.doing = DELIVERING;
        }
        break;
      case DELIVERING:
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
