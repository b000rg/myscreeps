/**
 * Checks if store is at its max capacity
 * @param {Store} store - The store being checked
 * @param {string=} resource_type - The type of resource you are checking for
 * @returns {boolean}
 */
module.exports.storeIsFull = (store, resource_type) =>
  resource_type
    ? store[resource_type] === store.getCapacity(resource_type)
    : !store.getFreeCapacity();

/**
 * Checks if store is completely empty
 * @param {Store} store - The store being checked
 * @param {string=} resource_type - The type of resource you are checking for
 * @returns {boolean}
 */
module.exports.storeIsEmpty = (store, resource_type) =>
  resource_type
    ? !store.getUsedCapacity(resource_type)
    : !store.getUsedCapacity();
