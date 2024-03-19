class HttpError extends Error {
  constructor(messgae, errorCode) {
    super(messgae); //Message
    this.code = errorCode; //ErrorCode
  }
}

module.exports = HttpError;
