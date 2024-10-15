using System.ComponentModel.DataAnnotations.Schema;

namespace api
{
  [Table("blogs")]
  public class Blog
  {
    [Column("id")]
    public int Id { get; set; }

    [Column("title")]
    public string Title { get; set; }

    [Column("description")]
    public string Description { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }
    public User User { get; set; }
  }
}