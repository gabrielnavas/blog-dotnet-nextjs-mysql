namespace api {
  public interface IAuthService {
    Task<string> SignIn(SignInDto dto);
  }
}