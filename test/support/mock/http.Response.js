module.exports = function fauxRes() {
  var fn = function (){};
  return {
    headers: {},
    resume: fn,
    on: fn,
    emit: fn,
    setHeader: fn,
    end: fn,
    write: fn
  };
};
