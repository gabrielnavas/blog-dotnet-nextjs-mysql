namespace api {
  public interface IUserService {
    Task CreateUser(CreateUserDto dto);
  }
}