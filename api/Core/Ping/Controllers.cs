using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api
{

  [ApiController]
  [Route("api/[controller]")]
  public class PingController : ControllerBase
  {
    // Rota pública, acessível por qualquer usuário (não requer autenticação)
    [HttpGet]
    public async Task<IActionResult> Pong()
    {
      return Ok(new
      {
        message = "pongou public!"
      });
    }


    // Rota protegida, requer autenticação (qualquer usuário autenticado)
    [Authorize]
    [HttpGet("user")]
    public async Task<IActionResult> PongAutenticado()
    {
      return Ok(new
      {
        message = "pongou autenticado!"
      });
    }

    // Rota protegida por role específica (somente usuários com role 'manager')
    [Authorize(Roles = "Manager")]
    [HttpGet("manager")]
    public async Task<IActionResult> PongManager()
    {
      return Ok(new
      {
        message = "pongou com role manager!"
      });
    }

      // Rota protegida por política específica (exemplo de política "Admin")
    [Authorize(Policy = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> PongAdmin()
    {
      return Ok(new
      {
        message = "pongou com policy Admin!"
      });
    }
  }
}