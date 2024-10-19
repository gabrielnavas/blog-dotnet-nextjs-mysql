using System.Drawing;
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
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
        {
          return StatusCode(400, new
          {
            message = "Invalid user ID in the token."
          });
        }

        var post = await _postService.CreatePost(userIdInt, request);

        return StatusCode(201, new
        {
          post
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


    [HttpPatch("{postId}/like")]
    // [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> TogglePostLike(int postId)
    {
      try
      {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
        {
          return StatusCode(400, new
          {
            message = "Invalid user ID in the token."
          });
        }

        await _postService.TogglePostLike(userIdInt, postId);
        return StatusCode(204);
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

    [HttpGet]
    // [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> FindPosts(int page = 0, int size = 10)
    {
      try
      {
        // find post by user id or anonymous
        int? userId = null;
        var claimsUser = User.FindFirst(ClaimTypes.NameIdentifier);
        if (claimsUser != null && !string.IsNullOrEmpty(claimsUser.Value))
        {
          userId = int.Parse(claimsUser.Value);
        }

        var posts = await _postService.FindPosts(userId, page, size);

        return StatusCode(200, new
        {
          posts
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

    [HttpDelete("{postId}")]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> RemovePost(int postId)
    {
      try
      {
        await _postService.RemovePost(postId);
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
    // [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> DownloadImage(int postId)
    {
      try
      {
        var (file, imageName) = await _postService.LoadPostImage(postId);
        return File(file, "application/octet-stream", imageName);
      }
      catch (Exception ex) when (ex is PostNotFoundException || ex is ImagePostNotFound)
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