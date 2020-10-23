let roleUpgrader = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.memory.upgrading && creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizeStyle: {stroke: '#ffffffff'}});
            };
        } else {
            creep.memory.upgrading = false;
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) creep.memory.upgrading = true;
        };
    }
};

module.exports = roleUpgrader;