namespace api
{
  public interface ITokenService
  {
    string GenerateTokenAsync(GenerateTokenDto dto);
  }
}