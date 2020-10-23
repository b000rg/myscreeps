let roleMaintenance = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.memory.working) {
            if (!creep.memory.currentTarget) {
                let targets = _.filter(creep.room.find(FIND_STRUCTURES), structure => (
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
            let bestSource = creep.pos.findClosestByPath(FIND_SOURCES, {filter: source => source.energy && true});
            if (creep.harvest(bestSource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(bestSource, {visualizeStyle: {stroke: '#ffffffff'}});
            } else if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) creep.memory.working = true;
        };
    }
};

module.exports = roleMaintenance;