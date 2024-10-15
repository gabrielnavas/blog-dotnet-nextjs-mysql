using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly IUserService _userService;
    private readonly IAuthService _authService;

    public AuthController(
      IUserService userService,
      IAuthService authService
    ) : base()
    {
      _userService = userService;
      _authService = authService;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] CreateUserDto request)
    {
      try
      {
        await _userService.CreateUser(request);
        return StatusCode(204);

      }
      catch (Exception ex) when (
        ex is PasswordAndPasswordConfirmationIsNotEquals
      || ex is UserAlreadyExistsWithException)
      {
        return StatusCode(400, new
        {
          message = ex.Message
        });
      }
      catch (UserAlreadyExistsWithException ex)
      {
        return StatusCode(400, new
        {
          message = ex.Message
        });
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return StatusCode(500, new
        {
          message = "Erro no servidor."
        });
      }
    }

    [HttpGet]
    


    [HttpPost("signin")]
    public async Task<IActionResult> SignIn([FromBody] SignInDto dto)
    {
      try
      {
        string token = await _authService.SignIn(dto);
        return Ok(new
        {
          token = token
        });
      }
      catch (UserNotFoundException ex)
      {
        return StatusCode(400, new
        {
          message = ex.Message
        });
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return StatusCode(500, new
        {
          message = "Erro no servidor."
        });
      }
    }
  }
}