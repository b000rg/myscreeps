const roleHarvester = require("role.harvester");

// lookup table for role execution from creep memory
const roleDefinitions = { harvester: roleHarvester };

// tries to keep at least this many of each role in the game
const roleQuotas = { harvester: 3 };

// don't want to pay for the sins of our fathers
const eraseDeadCreepsMemory = () => {
  for (creep in Memory.creeps)
    if (!Game.creeps[creep]) {
      console.log("☠ Can't find " + creep + ". Clearing memory.");
      delete Memory.creeps[creep];
    }
};

// checks if role quotas have been reached
const countCreeps = (creeps, quotas = roleQuotas) => {
  const creepCount = {};
  for (creep of creeps) {
    if (!creepCount[creep.memory.role]++) creepCount[creep.memory.role] = 1;
  }
  for (role in quotas) {
    if (creepCount[role] !== quotas[role]) return role;
  }
  return null;
};

// figure out if role quotas are met and spawns creeps with necessary role
const spawnNecessaryCreeps = () => {
  let deficitRole = countCreeps(
    Game.spawns["Spawn1"].room.find(FIND_MY_CREEPS)
  );
  if (deficitRole) {
    Game.spawns["Spawn1"].spawnCreep(
      ...roleDefinitions[deficitRole].spawn(Game.spawns["Spawn1"])
    );
  }
};
// TODO: Add role spawn priorities
// TODO: Add parameter for StructureSpawn

// run role AI on all creeps
const runCreeps = () => {
  for (creep in Game.creeps) {
    if (Game.creeps[creep].memory.role)
      roleDefinitions[Game.creeps[creep].memory.role].run(Game.creeps[creep]);
  }
};
//TODO: CLean up this mess

module.exports.loop = () => {
  eraseDeadCreepsMemory();
  spawnNecessaryCreeps();
  runCreeps();
};
