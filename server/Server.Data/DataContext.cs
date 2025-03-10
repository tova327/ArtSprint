using Microsoft.EntityFrameworkCore;
using Server.Core.models;
using System.Diagnostics;

public class DataContext : DbContext
{
    public DbSet<UserModel> Users { get; set; }
    public DbSet<PaintingModel> Paintings { get; set; }
    public DbSet<CompetitionModel> Competitions { get; set; }
    public DbSet<CompetitionPaintingModel> CompetitionPaintings { get; set; }
    public DbSet<CommentModel> Comments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySql(@"Server=localhost;Database=artsprint;user=root;password=1234;",
            new MySqlServerVersion(new Version(8, 0, 21)));
        optionsBuilder.LogTo(massage=>Debug.WriteLine(massage));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuring composite keys
        modelBuilder.Entity<CompetitionPaintingModel>()
            .HasKey(cp => new { cp.IdPaint, cp.IdCompetition });

    }
}