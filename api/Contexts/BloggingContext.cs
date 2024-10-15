using Microsoft.EntityFrameworkCore;


namespace api
{
  public class BloggingContext : DbContext
  {
    public DbSet<User> User { get; set; }
    public DbSet<Blog> Blog { get; set; }
    public DbSet<Post> Post { get; set; }

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
    }
  }
}