using AutoMapper;
using Server.Core.DTOs;
using Server.Core.models;
using Server.Core.Repositories;
using Server.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Service.Services
{
    public class CommentService : ICommentService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public CommentService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CommentDTO>> GetAllAsync()
        {
            var comments = await _repositoryManager.Comments.GetAllAsync();
            var commentsList=comments.ToList();
            return _mapper.Map<IEnumerable<CommentDTO>>(commentsList);
        }

        public async Task<CommentDTO?> GetByIdAsync(int id)
        {
            var comment = await _repositoryManager.Comments.GetByIdAsync(id);
            return _mapper.Map<CommentDTO?>(comment);
        }

        public async Task<CommentDTO> AddAsync(CommentDTO entity)
        {
            var comment = await _repositoryManager.Comments.AddAsync(_mapper.Map<CommentModel>(entity));
            await _repositoryManager.SaveAsync();
            return _mapper.Map<CommentDTO?>(comment);
        }

        public async Task<CommentDTO> UpdateAsync(int id, CommentDTO entity)
        {
            var comment = await _repositoryManager.Comments.UpdateAsync(id,_mapper.Map<CommentModel>( entity));
            await _repositoryManager.SaveAsync();
            return _mapper.Map<CommentDTO>( comment);
        }

        public async Task DeleteAsync(int id)
        {
            await _repositoryManager.Comments.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }
    }
}
