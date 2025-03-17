using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;
using Server.Core.Repositories;
using Server.Data.repositories;

public class CommentRepository:GenericRepository<CommentModel>,ICommentRepository
{
    private readonly DataContext _context;

    public CommentRepository(DataContext context):base(context)
    {
        _context = context;
    }

}
