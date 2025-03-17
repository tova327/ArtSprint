using Server.Core.DTOs;
using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentModel>> GetAllAsync();
        Task<CommentDTO?> GetByIdAsync(int id);
        Task<CommentDTO> AddAsync(CommentDTO entity);
        Task<CommentDTO> UpdateAsync(int id, CommentDTO entity);
        Task DeleteAsync(int id);
    }
}
