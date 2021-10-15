exports.REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  ID_MONGO: /^[a-f\d]{24}$/i,
  OTP: /^\d{4}$/,
  PASSWORD: /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
  PHONE_VN: /^0\d{9}$/,
  UNICODE_LETTER: /^[\p{L}\s]{1,20}$/u,
  UNICODE_STRING: /^[\p{L}\s0-9/.,]{1,30}$/u,
};
