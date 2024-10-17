using System.Data.Entity;
using System.Reflection;

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
      var user = _context.User.Where(user => user.Id == userId).FirstOrDefault();
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

      await _context.Post.AddAsync(post);
      await _context.SaveChangesAsync();

      return new PostDto(post.Id, post.Content, post.UserId, post.Likes);
    }

    public async Task<PostDto> UpdatePostImage(int postId, IFormFile file)
    {
      // Busca o post de forma assíncrona
      var post = _context.Post.FirstOrDefault(p => p.Id == postId);
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
        post.Likes
      );
    }

    public async Task<(byte[] file, string imageName)> LoadPostImage(int postId)
    {
      // Busca o post de forma assíncrona
      var post = _context.Post.FirstOrDefault(p => p.Id == postId);
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

    public async Task<List<PostDto>> FindPosts(int userId)
    {
      return _context.Post.Where(post => post.UserId == userId)
       .Select(post => new PostDto(
         post.Id,
         post.Content,
         post.UserId,
         post.Likes
       ))
       .Take(10)
       .Skip(0)
       .ToList();
    }
  }
}
