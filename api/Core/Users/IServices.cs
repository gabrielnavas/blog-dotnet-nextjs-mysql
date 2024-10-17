namespace api {
  public interface IUserService {
    Task CreateUser(CreateUserDto dto);
    Task<UserDto> FindUserByEmail(string email);
    Task<UserDto> FindUserById(int userId);
  }
}