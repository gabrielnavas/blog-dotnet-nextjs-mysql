
namespace api
{
  public interface IPostService
  {
    Task<PostDto> CreatePost(int userId, CreatePostDto dto);
    Task TogglePostLike(int userId, int postId);
    Task<PostDto> UpdatePostImage(int postId, IFormFile file);

    Task<(byte[] file, string imageName)> LoadPostImage(int postId);
    Task<List<PostDto>> FindPosts(int? loggedUserId, int page, int size);

    Task RemovePost(int postId);
  }
}