using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api
{

  [ApiController]
  [Route("api/[controller]")]
  public class PostController : ControllerBase
  {
    private readonly IPostService _postService;
    private readonly IUserService _userService;

    public PostController(IPostService postService)
    {
      _postService = postService;
    }


    [HttpPost]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto request)
    {
      try
      {
        // Pega o userId da claim e tenta converter para inteiro
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
        {
          return StatusCode(400, new
          {
            message = "Invalid user ID in the token."
          });
        }

        // Chama o serviço de criação de post com o userId e a request recebida
        var post = await _postService.CreatePost(userIdInt, request);

        // Retorna o status 201 com o post criado
        return StatusCode(201, new
        {
          post
        });
      }
      catch (UserNotFoundException ex)
      {
        // Captura exceção de usuário não encontrado
        return StatusCode(400, new
        {
          message = ex.Message
        });
      }
      catch (Exception ex)
      {
        // Captura qualquer outra exceção
        Console.WriteLine(ex);
        return StatusCode(500, new
        {
          message = "Erro no servidor."
        });
      }
    }


    [HttpGet]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> FindPosts()
    {
      try
      {
        // Pega o userId da claim e tenta converter para inteiro
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
        {
          return StatusCode(400, new
          {
            message = "Invalid user ID in the token."
          });
        }

        // Chama o serviço de criação de post com o userId e a request recebida
        var posts = await _postService.FindPosts(userIdInt);

        // Retorna o status 201 com o post criado
        return StatusCode(200, new
        {
          posts
        });
      }
      catch (UserNotFoundException ex)
      {
        // Captura exceção de usuário não encontrado
        return StatusCode(400, new
        {
          message = ex.Message
        });
      }
      catch (Exception ex)
      {
        // Captura qualquer outra exceção
        Console.WriteLine(ex);
        return StatusCode(500, new
        {
          message = "Erro no servidor."
        });
      }
    }

    [HttpPatch("{postId}/image")]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> UpdateImage(int postId, IFormFile image)
    {
      try
      {
        await _postService.UpdatePostImage(postId, image);
        return StatusCode(204);
      }
      catch (PostNotFoundException ex)
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

    [HttpGet("{postId}/image")]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> DownloadImage(int postId)
    {
      try
      {
        var (file, imageName) = await _postService.LoadPostImage(postId);
        return File(file, "application/octet-stream", imageName);
      }
      catch (PostNotFoundException ex)
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