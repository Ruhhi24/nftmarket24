export const getTopCreators = (creators) => {
  const finalCreators = [];

  const finalResults = creators.reduce((index, currentValue) => {
    (index[currentValue.seller] = index[currentValue.seller] || []).push(
      currentValue
    );

    return index;
  }, {});
  Object.entries(finalResults).forEach((items) => {
    const seller = items[0];
    const total = items[1]
      .map((newItem) => Number(newItem.price))
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    finalCreators.push({ seller, total });
  });

  return finalCreators;
};
