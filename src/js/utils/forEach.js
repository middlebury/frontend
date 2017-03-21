function forEach(items, cb) {
  for (var i = 0, count = items.length; i < count; i++) {
    cb(items[i], i);
  }
}

export default forEach;
