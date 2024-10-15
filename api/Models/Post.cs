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

   [Column("blog_id")]
    public int BlogId { get; set; }
    public Blog Blog { get; set; }
  }
}