let roleBuilder = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) creep.memory.building = false;
        } else {
            let bestSource = creep.pos.findClosestByPath(FIND_SOURCES, {filter: source => source.energy && true});
            if (creep.harvest(bestSource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(bestSource, {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) creep.memory.building = true;
        };
    }
};

module.exports = roleBuilder;