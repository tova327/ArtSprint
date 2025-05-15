using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using Server.Core.models;
using Server.Data;
using System.Diagnostics;

public class DataContext : DbContext,IDataContext
{
    private readonly IConfiguration _configuration;
    public DbSet<UserModel> Users { get; set; }
    public DbSet<PaintingModel> Paintings { get; set; }
    public DbSet<CompetitionModel> Competitions { get; set; }
    public DbSet<CompetitionPaintingModel> CompetitionPaintings { get; set; }
    public DbSet<CommentModel> Comments { get; set; }
    public DataContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySql(_configuration["DbConnectionString"],
            new MySqlServerVersion(new Version(8, 0, 21)),
            mysqlOptions => mysqlOptions.EnableRetryOnFailure());
        
        optionsBuilder.LogTo(massage=>Debug.WriteLine(massage));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuring composite keys
        modelBuilder.Entity<CompetitionPaintingModel>()
            .HasKey(cp => new { cp.IdPaint, cp.IdCompetition });

    }
    public virtual EntityEntry Entry(object entity)
    {
        return base.Entry(entity);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await base.SaveChangesAsync();
    }
}