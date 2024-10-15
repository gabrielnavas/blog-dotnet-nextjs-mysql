
using Microsoft.EntityFrameworkCore;
using BC = BCrypt.Net.BCrypt;

namespace api
{
  public class UserService : IUserService
  {
    private readonly BloggingContext _context;

    public UserService(BloggingContext context)
    {
      _context = context;
    }
    public async Task CreateUser(CreateUserDto dto)
    {
      if (dto.Password != dto.ConfirmPassword)
      {
        throw new PasswordAndPasswordConfirmationIsNotEquals("Senha e Confirmação de senha não estão iguais.");
      }

      var userByEmail = await _context.User
      .Where(user => user.Email.ToLower() == dto.Email.ToLower())
      .FirstOrDefaultAsync();
      if (userByEmail != null)
      {
        throw new UserAlreadyExistsWithException("Já existe um usuário com esse e-mail.");
      }
      var user = new User();
      user.Fullname = dto.Fullname;
      user.Email = dto.Email;
      user.PasswordHash = BC.HashPassword(dto.Password);
      user.Role = Role.User;

      await _context.AddAsync(user);
      await _context.SaveChangesAsync();
    }
  }
}