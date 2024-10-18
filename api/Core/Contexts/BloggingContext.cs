using Microsoft.EntityFrameworkCore;


namespace api
{
  public class BloggingContext : DbContext
  {
    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<PostLike> PostLikes { get; set; }

    public BloggingContext(DbContextOptions<BloggingContext> options) : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
      base.OnConfiguring(options);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<User>()
        .Property(u => u.Role)
        .HasConversion(
          r => r.ToString(), // converte a role para string quando salvar
          r => (Role)Enum.Parse(typeof(Role), r) // converte string para role quando ler
        );

      // Definir chave composta para PostLike
      modelBuilder.Entity<PostLike>()
          .HasKey(pl => new { pl.PostId, pl.UserId });

      // Definir relacionamentos
      modelBuilder.Entity<PostLike>()
          .HasOne(pl => pl.Post)
          .WithMany(p => p.PostLikes)
          .HasForeignKey(pl => pl.PostId);

      modelBuilder.Entity<PostLike>()
          .HasOne(pl => pl.User)
          .WithMany(u => u.PostLikes)
          .HasForeignKey(pl => pl.UserId);
    }
  }
}