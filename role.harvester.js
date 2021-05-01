const { HARVESTING, DELIVERING } = require("userConstants");
const { storeIsFull, storeIsEmpty } = require("helperFunctions");

const harvesterParts = [MOVE, MOVE, WORK, CARRY];

const findBestStorageSite = (creep) => {
  let myStructures = creep.room.find(MY_STRUCTURES);
  let spawnsAndExtensions = myStructures.filter(
    (struct) =>
      struct.structureType === STRUCTURE_SPAWN ||
      struct.structureType === STRUCTURE_EXTENSION
  );
  let containersAndStorage = myStructures.filter(
    (struct) =>
      struct.structureType === STRUCTURE_CONTAINER ||
      struct.structureType === STRUCTURE_STORAGE
  );

  for (spawn in spawnsAndExtensions) {
    if (!storeIsFull(spawn.store)) return spawn.id;
  }
  for (container in containersAndStorage) {
    if (!storeIsFull(container.store)) return container.id;
  }
  return null;
};

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
        if (storeIsFull(creep.store)) {
          creep.memory.target = findBestStorageSite(creep);
          if (creep.memory.target) creep.memory.doing = DELIVERING;
        } else {
          if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
        break;
      case DELIVERING:
        if (storeIsEmpty(creep.store)) {
          creep.memory.doing = HARVESTING;
          creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES).id;
        } else {
          if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
        break;
    }
  },
};

module.exports = roleHarvester;
