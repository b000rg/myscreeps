let roleHarvester = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizeStyle: {stroke: '#ffffffff'}});
            };
        } else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (
                        (structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_CONTAINER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                }
            });
            if (targets) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizeStyle: {stroke: '#ffffffff'}});
                };
            };
        };
    }
};

module.exports = roleHarvester;