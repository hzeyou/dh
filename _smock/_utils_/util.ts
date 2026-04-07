
function createCRUD(initialList) {
  const list = [...initialList];
  let nextId = Math.max(...list.map(item => item.id), 0) + 1;

  return {
    getList: () => list,
    getById: (id) => list.find(v => v.id === id),
    create: (data) => {
      const newItem = { ...data, id: nextId++ };
      list.push(newItem);
      return newItem;
    },
    update: (id, data) => {
      const index = list.findIndex(d => d.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...data, id };
        return list[index];
      }
      return null;
    },
    delete: (ids) => {
      const deleted = [];
      ids.forEach(id => {
        const index = list.findIndex(d => d.id === id);
        if (index !== -1) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          deleted.push(...list.splice(index, 1));
        }
      });
      return deleted;
    }
  };
}

module.exports = { createCRUD };
