(function(window) {

  window.Promise = function(cb) {
    var self = this;
    this._state = 'pending';
    cb(
      function(result) {
        self._state = 'fullfiled';
        self.result = result;
      },

      function(error) {
        self._state = 'rejected';
        self.error = error;
      }
    );
  };

  window.Promise.prototype.then = function(successCallback, errorCallback) {
    var self = this;

    return new Promise(function(resolve, reject) {
      if (self._state === 'pending') {
        return;
      }

      var nextResult;

      if (self._state === 'rejected') {
        if (!errorCallback) {
          return;
        }

        nextResult = errorCallback(self.error);

        if (nextResult && nextResult.then) {
          return nextResult.then(function() {
            reject(nextResult);
          });
        }

        return reject(nextResult);
      }

      if (!successCallback) {
        return;
      }

      nextResult = successCallback(self.result);

      if (nextResult && nextResult.then) {
        return nextResult.then(function(result) {
          resolve(result);
        });
      }

      resolve(nextResult);
    });
  };

}(global));
