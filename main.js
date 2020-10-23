let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleMaintenance = require('role.maintenance');



// lookup table for role execution
const roleDefinitions = {
	harvester: roleHarvester,
	upgrader: roleUpgrader,
	builder: roleBuilder,
	maintenance: roleMaintenance
};

// target number of creeps for each role
const roleQuotas = {
	harvester: 3,
	upgrader: 2,
	builder: 2,
	maintenance: 5
};

// body part lists for each role
const roleBodies = {
	harvester: [WORK, CARRY, MOVE],
	upgrader: [WORK, CARRY, MOVE],
	builder: [WORK, CARRY, MOVE],
	maintenance: [WORK, CARRY, MOVE]
};



const findNeededRole = () => {
	const currentCounts = {};
	for (let name in Game.creeps) {
		let role = Game.creeps[name].memory.role;
		if (currentCounts[role]) currentCounts[role]++
		else currentCounts[role] = 1;
	};
	for (let role in roleQuotas) {
		if ((currentCounts[role] || 0) < roleQuotas[role]) return role;
	};
	return null;
};

const clearDeadCreepsMemory = () => {
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			console.log(`${name} cannot be found. Freeing memory.`);
			delete Memory.creeps[name];
		};
	};
};

/** @param {Creep} creep **/
const executeRole = (creep) => {
	roleDefinitions[creep.memory.role].run(creep);
};



module.exports.loop = () => {
	clearDeadCreepsMemory();

	let neededRole = findNeededRole();
	if (neededRole) {
		Game.spawns['Spawn1'].spawnCreep(roleBodies[neededRole], neededRole + Game.time, {memory: {role: neededRole}});
	};

	for (let name in Game.creeps) {
		executeRole(Game.creeps[name]);
	};
};