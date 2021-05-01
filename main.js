const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const roleMaintainer = require("role.maintainer");

// lookup table for role execution from creep memory
const roleDefinitions = {
  harvester: roleHarvester,
  upgrader: roleUpgrader,
  builder: roleBuilder,
  maintainer: roleMaintainer,
};

// tries to keep at least this many of each role in the game
const roleQuotas = [
  { roleName: "harvester", quota: 4 },
  { roleName: "upgrader", quota: 3 },
  { roleName: "builder", quota: 5 },
  { roleName: "maintainer", quota: 4 },
];

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
  for (role of quotas) {
    console.log(
      `${role.roleName}: ${creepCount[role.roleName] || 0}/${role.quota}`
    );
    if ((creepCount[role.roleName] || 0) < role.quota) return role.roleName;
  }
  return null;
};

// figure out if role quotas are met and spawns creeps with necessary role
const spawnNecessaryCreeps = () => {
  let deficitRole = countCreeps(
    Game.spawns["Spawn1"].room.find(FIND_MY_CREEPS)
  );
  if (deficitRole) {
    console.log(`deficit: ${deficitRole}`);
    if (
      !Game.spawns["Spawn1"].spawnCreep(
        ...roleDefinitions[deficitRole].spawn(Game.spawns["Spawn1"])
      )
    )
      console.log(`Spawning ${deficitRole}.`);
  }
};
// TODO: Add parameter for StructureSpawn

// run role AI on all creeps
const runCreeps = () => {
  for (creep in Game.creeps) {
    if (Game.creeps[creep].memory.role)
      try {
        roleDefinitions[Game.creeps[creep].memory.role].run(Game.creeps[creep]);
      } catch (err) {
        console.log(`Error while trying to run ${creep}:\r`);
        console.log(err);
      }
  }
};
//TODO: CLean up this mess

module.exports.loop = () => {
  eraseDeadCreepsMemory();
  spawnNecessaryCreeps();
  runCreeps();
};
