let roleUpgrader = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.memory.upgrading && creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizeStyle: {stroke: '#ffffffff'}});
            };
        } else {
            creep.memory.upgrading = false;
            let bestSource = creep.pos.findClosestByPath(FIND_SOURCES, {filter: source => source.energy && true});
            if (creep.harvest(bestSource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(bestSource, {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) creep.memory.upgrading = true;
        };
    }
};

module.exports = roleUpgrader;