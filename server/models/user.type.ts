enum RoleUser {
  admin = 'ADMIN_ROLE',
  user = 'USER_ROLE',
}

enum ErrorUser {
  /** invalid name: name required  */
  NameRequired = 'NAME_REQUIRED',
  /** invalid email: email required  */
  EmailRequired = 'EMAIL_REQUIRED',
  /** invalid email: user exist  */
  EmailDuplicate = 'EMAIL_DUPLICATE',
  /** invalid email: invalid format  */
  EmailInvalid = 'EMAIL_INVALID',
  /** invalid email: email required  */
  PasswordRequired = 'PASSWORD_REQUIRED',
  /** invalid password: min 8 characters  */
  PasswordMin = 'PASSWORD_MIN',
  /** invalid password: format  */
  PasswordFormat = 'PASSWORD_FORMAT',
}

enum ValidUser {
  /** user created  */
  UserCreated = 'USER_CREATED',
}

export { RoleUser, ErrorUser, ValidUser };
