namespace api
{
  public class AuthService : IAuthService
  {
    private readonly ITokenService _tokenService;
    private readonly BloggingContext _context;

    public AuthService(
      ITokenService tokenService,
      BloggingContext context
    )
    {
      _tokenService = tokenService;
      _context = context;
    }

    public async Task<string> SignIn(SignInDto dto)
    {
      var user = _context.User
      .Where(user => user.Email.ToLower() == dto.Email.ToLower())
      .FirstOrDefault();
      if (user == null)
      {
        throw new UserNotFoundException("Email ou Senha incorreto");
      }

      var tokenParams = new GenerateTokenDto(user.Email, user.Role);
      string token = _tokenService.GenerateTokenAsync(tokenParams);
      return token;
    }
  }
}