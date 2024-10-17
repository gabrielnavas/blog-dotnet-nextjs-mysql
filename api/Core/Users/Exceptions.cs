namespace api
{
  class UserAlreadyExistsWithException : Exception
  {
    public UserAlreadyExistsWithException(string message) 
      : base(message) { }
  }

  class PasswordAndPasswordConfirmationIsNotEquals : Exception
  {
    public PasswordAndPasswordConfirmationIsNotEquals(string message) : base(message) { }
  }
}