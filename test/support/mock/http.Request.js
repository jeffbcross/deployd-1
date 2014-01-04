module.exports = function fauxReq(url) {
  var fn = function (){};
  return {
    url: url,
    headers: {},
    resume: fn,
    on: fn,
    emit: fn
  };
}
