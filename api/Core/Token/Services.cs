using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace api
{
  public class TokenService : ITokenService
  {

    private readonly AppSettings _appSettings;

    public TokenService(IOptions<AppSettings> appSettings)
    {
      _appSettings = appSettings.Value;
    }

    public string GenerateTokenAsync(GenerateTokenDto dto)
    {
      var tokenHandler = new JwtSecurityTokenHandler();
      byte[] key = Encoding.ASCII.GetBytes(_appSettings.JwtKey);
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[]{
          new Claim(ClaimTypes.NameIdentifier, dto.UserId.ToString()),
          new Claim(ClaimTypes.Role, dto.UserRole.ToString())
        }),
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = new SigningCredentials(
          new SymmetricSecurityKey(key),
          SecurityAlgorithms.HmacSha256Signature
        )
      };
      SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}