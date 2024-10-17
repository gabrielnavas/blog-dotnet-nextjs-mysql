
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Core.Users
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService) {
            this.userService = userService;
        }

        [HttpGet("{userId}")]
        [Authorize(Roles = "Admin,Manager,User")]
        public async Task<IActionResult> FindUserById(int userId)
        {
            try
            {
                var user = await userService.FindUserById(userId);
                return StatusCode(200, new
                {
                    user
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