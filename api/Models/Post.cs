using System.ComponentModel.DataAnnotations.Schema;

namespace api
{
  [Table("posts")]
  public class Post
  {
    [Column("id")]
    public int Id { get; set; }

    [Column("content")]
    public string Content { get; set; }

    [Column("likes")]
    public int Likes { get; set; }

    [Column("image_name")]
    public string ImageName { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }
    public User User { get; set; }
  }
}