using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;
using Server.Core.Repositories;
using Server.Data.repositories;

public class CompetitionPaintingRepository:GenericRepository<CompetitionPaintingModel>, ICompetitionPaintingRepository
{
    private readonly DataContext _context;

    public CompetitionPaintingRepository(DataContext context):base(context)
    {
        _context = context;
    }

    
}