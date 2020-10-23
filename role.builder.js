let roleBuilder = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) creep.memory.building = false;
        } else {
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) creep.memory.building = true;
        };
    }
};

module.exports = roleBuilder;