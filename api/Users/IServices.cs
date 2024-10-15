namespace api {
  public interface IUserService {
    Task CreateUser(CreateUserDto dto);
    Task<UserDto> FindUserByEmail(string email);
  }
}