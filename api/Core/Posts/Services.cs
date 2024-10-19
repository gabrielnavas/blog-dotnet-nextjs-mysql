using System.Data.Entity;
using System.Reflection;
using Org.BouncyCastle.Security;

namespace api
{
  public class PostServices : IPostService
  {

    private readonly BloggingContext _context;
    private readonly IWebHostEnvironment _environment;

    public PostServices(BloggingContext context, IWebHostEnvironment environment)
    {
      _context = context;
      _environment = environment;
    }

    public async Task<PostDto> CreatePost(int userId, CreatePostDto dto)
    {
      var user = _context.Users.Where(user => user.Id == userId).FirstOrDefault();
      if (user == null)
      {
        throw new UserNotFoundException("Usuário não encontrado");
      }

      var post = new Post
      {
        Content = dto.Content,
        Likes = 0,
        UserId = user.Id,
      };

      await _context.Posts.AddAsync(post);
      await _context.SaveChangesAsync();

      return new PostDto(post.Id, post.Content, post.UserId, post.Likes, false);
    }

    public async Task<PostDto> UpdatePostImage(int postId, IFormFile file)
    {
      // Busca o post de forma assíncrona
      var post = _context.Posts.FirstOrDefault(p => p.Id == postId);
      if (post == null)
      {
        throw new PostNotFoundException($"Post {postId} não encontrado");
      }

      // Verifica se o arquivo é nulo ou tem comprimento zero
      if (file == null || file.Length == 0)
      {
        throw new MissingFileImageException("Não foi possível ler a imagem");
      }

      string uploads = "uploads";
      string posts = "posts";
      string fullPathPosts = $"{uploads}/{posts}";

      string workingDirectory = Environment.CurrentDirectory;
      string uploadsDirectory = $"{workingDirectory}/{uploads}";
      if (!Directory.Exists(uploadsDirectory))
      {
        Directory.CreateDirectory(uploadsDirectory);
      }
      string postsDirectory = $"{uploadsDirectory}/{posts}";
      if (!Directory.Exists(postsDirectory))
      {
        Directory.CreateDirectory(postsDirectory);
      }
      string imagePathName = $"{postsDirectory}/{file.FileName}";
      using (var stream = File.Create(imagePathName))
      {
        await file.CopyToAsync(stream);
      }

      post.ImageName = file.FileName;
      await _context.SaveChangesAsync();

      // string imageUrl = GenerateImageUrl(scheme, host, fullPathPosts);

      return new PostDto
      (
        post.Id,
        post.Content,
        post.UserId,
        post.Likes,
        false
      );
    }

    public async Task<(byte[] file, string imageName)> LoadPostImage(int postId)
    {
      // Busca o post de forma assíncrona
      var post = _context.Posts.FirstOrDefault(p => p.Id == postId);
      if (post == null)
      {
        throw new PostNotFoundException($"Post {postId} não encontrado");
      }

      if (post.ImageName == null)
      {
        throw new ImagePostNotFound("Imagem do post não encontrada.");
      }

      string uploads = "uploads";
      string posts = "posts";
      string fullPathPosts = $"{uploads}/{posts}";

      string workingDirectory = Environment.CurrentDirectory;
      string uploadsDirectory = $"{workingDirectory}/{uploads}";
      if (!Directory.Exists(uploadsDirectory))
      {
        Directory.CreateDirectory(uploadsDirectory);
      }
      string postsDirectory = $"{uploadsDirectory}/{posts}";
      if (!Directory.Exists(postsDirectory))
      {
        Directory.CreateDirectory(postsDirectory);
      }
      string imagePathName = $"{postsDirectory}/{post.ImageName}";

      var file = await File.ReadAllBytesAsync(imagePathName);

      return (file, post.ImageName);
    }

    public async Task<List<PostDto>> FindPosts(int? loggedUserId, int page, int size)
    {
      if (size > 20)
      {
        throw new InvalidParameterException("O tamanho da página deve ter no máximo 20 itens.");
      }
      if (size <= 0)
      {
        throw new InvalidParameterException("O tamanho da página deve ser positivo.");
      }

      page = page == 0 ? page : (page - 1) * size;
      return _context.Posts
      .OrderByDescending(post => post.Id)
      .Skip(page)
      .Take(size)
      .Select(post => new PostDto(
         post.Id,
         post.Content,
         post.UserId,
         post.Likes,
         loggedUserId != null
         ? post.PostLikes.Where(postLike => postLike.UserId == loggedUserId).Count() > 0
         : false
       ))
       .ToList();
    }

    public async Task TogglePostLike(int userId, int postId)
    {
      using var transaction = _context.Database.BeginTransaction();

      var user = _context.Users.Find(userId);
      if (user == null)
      {
        throw new UserNotFoundException($"Usuário não encontrado com o id {userId}");
      }

      var post = _context.Posts.Find(postId);
      if (post == null)
      {
        throw new PostNotFoundException($"Post não encontrado com o id {postId}");
      }

      var postLike = _context.PostLikes.Where(postLike =>
        postLike.UserId == user.Id
        && postLike.PostId == post.Id)
        .FirstOrDefault();
      if (postLike == null)
      {
        postLike = new PostLike();
        postLike.UserId = user.Id;
        postLike.PostId = post.Id;
        await _context.PostLikes.AddAsync(postLike);

        post.Likes = post.Likes + 1;
      }
      else
      {
        _context.PostLikes.Remove(postLike);
        post.Likes = post.Likes - 1;
      }

      await _context.SaveChangesAsync();

      transaction.Commit();
    }
  }
}
