namespace api {
  public record CreateUserDto(string Fullname, string Email, string Password, string ConfirmPassword);
}