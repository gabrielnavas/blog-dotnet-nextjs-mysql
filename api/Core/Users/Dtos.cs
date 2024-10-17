namespace api {
  public record CreateUserDto(string Fullname, string Email, string Password, string ConfirmPassword);
  public record UserDto(string Fullname, string Email, Role role);
}