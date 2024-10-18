namespace api
{
  public record CreatePostDto(string Content);
  public record PostDto(int Id, string Content, int UserId, int Likes, bool loggedUserLiked);
}