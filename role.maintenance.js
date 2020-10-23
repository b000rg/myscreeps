let roleMaintenance = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.memory.working) {
            if (!creep.memory.currentTarget) {
                let targets = creep.room.find(FIND_STRUCTURES);
                targets = _.filter(targets, structure => (
                    (structure.my ||
                    structure.structureType === STRUCTURE_WALL) &&
                    structure.hits < structure.hitsMax
                ));
                currentTarget = targets.sort((a, b) => a.hits - b.hits)[0];
            };
            if (creep.repair(currentTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(currentTarget, {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
                creep.memory.working = false;
                delete creep.memory.currentTarget;
            };
        } else {
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) creep.memory.working = true;
        };
    }
};

module.exports = roleMaintenance;