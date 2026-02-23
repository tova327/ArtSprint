using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using Server.Core.models;
using Server.Data;
//using Server.Data.Migrations;
using System.Diagnostics;

public class DataContext : DbContext,IDataContext
{
    private readonly IConfiguration _configuration;
    public DbSet<UserModel> Users { get; set; }
    public DbSet<PaintingModel> Paintings { get; set; }
    public DbSet<CompetitionModel> Competitions { get; set; }
    public DbSet<CompetitionPaintingModel> CompetitionPaintings { get; set; }
    public DbSet<CommentModel> Comments { get; set; }
    public DbSet<CategoryModel> Categories { get; set; }
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
		modelBuilder.Entity<CategoryModel>()
		.HasOne(c => c.ParentCategory)
		.WithMany(c => c.SubCategories)
		.HasForeignKey(c => c.ParentCategoryId)
		.OnDelete(DeleteBehavior.Restrict);
		modelBuilder.Entity<PaintingModel>().HasOne<CategoryModel>().WithMany().HasForeignKey(p => p.CategoryId)
		.OnDelete(DeleteBehavior.Restrict); // optional, prevents cascade delete

		base.OnModelCreating(modelBuilder);

	}
    public virtual EntityEntry Entry(object entity)
    {
        return base.Entry(entity);
    }

    public async Task<int> SaveChangesAsync()
    {
		UpdateTimestamps();
		return await base.SaveChangesAsync();
    }
	private void UpdateTimestamps()
	{
		var entries = ChangeTracker
			.Entries()
			.Where(e => e.Entity is IHasTimestamps &&
						(e.State == EntityState.Added || e.State == EntityState.Modified));

		foreach (var entry in entries)
		{
			var entity = (IHasTimestamps)entry.Entity;
			if (entry.State == EntityState.Added)
			{
				entity.CreatedAt = DateTime.UtcNow;
			}
			entity.UpdatedAt = DateTime.UtcNow;
		}
	}
}

