using System.ComponentModel.DataAnnotations.Schema;

namespace api
{
  [Table("users")]
  public class User
  {
    [Column("id")]
    public int Id { get; set; }

    [Column("fullname")]
    public string Fullname { get; set; }

    [Column("email")]
    public string Email { get; set; }
    [Column("role")]
    public Role Role { get; set; }
    [Column("password_hash")]
    public string PasswordHash { get; set; }
  }
}