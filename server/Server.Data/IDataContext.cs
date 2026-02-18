using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using Server.Core.models;

namespace Server.Data
{
    public interface IDataContext
    {

        public DbSet<UserModel> Users { get; set; }
        public DbSet<CommentModel> Comments { get; set; }
        public DbSet<CompetitionModel> Competitions { get; set; }
        public DbSet<CompetitionPaintingModel> CompetitionPaintings { get; set; }
        public DbSet<PaintingModel> Paintings { get; set; }
		public DbSet<CategoryModel> Categories { get; set; }


		public Task<int> SaveChangesAsync(); 
        EntityEntry Entry(object entity);

    }
}
